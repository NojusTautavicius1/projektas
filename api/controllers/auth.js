import {
  body,
  param,
  validationResult,
  matchedData,
} from "express-validator";

import * as User from "../models/user.js";

import bcryptjs from "bcryptjs";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";

import { logActivity } from "./activity.js";

const hasJwtSecret = Boolean(JWT_SECRET);

if (hasJwtSecret) {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.selectById(jwt_payload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
} else {
  console.error("JWT_SECRET nėra nustatytas. Auth endpointai neveiks, kol nebus sukonfigūruotas env.");
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.selectByEmail(profile.emails[0].value);
          if (!user) {
            const insertId = await User.insert({
              email: profile.emails[0].value,
              nickname: profile.displayName || `user_${profile.id}`,
              password: "oauth", // dummy password for OAuth users
            });
            user = await User.selectById(insertId);
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

export const isAuth = (req, res, next) => {
  if (!hasJwtSecret) {
    return res.status(500).json({ message: "Serverio konfigūracijos klaida: JWT_SECRET nėra nustatytas" });
  }

  passport.authenticate("jwt", { session: false }, function (err, user, info) {   
    if (user) {
      req.user = user;
      return next();
    }
    res.status(401);
    return next({message: "Unauthorized"});
  })(req, res, next);
};

export const isAdmin = (req, res, next) => {
  if (!hasJwtSecret) {
    return res.status(500).json({ message: "Serverio konfigūracijos klaida: JWT_SECRET nėra nustatytas" });
  }

  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (user && user.roleId === 3) {
      req.user = user;
      return next();
    }
    res.status(401);
    return next({message: "Unauthorized"});
  })(req, res, next);
};

export const authValidator = () => [
  body("email").trim().notEmpty().withMessage("El. paštas yra privalomas").isEmail().withMessage("Neteisingas el. pašto formatas").escape(),
  body("password").trim().notEmpty().withMessage("Slaptažodis yra privalomas").escape(),
];

export const registerValidator = () => [
  body("email").trim().notEmpty().withMessage("El. paštas yra privalomas").isEmail().withMessage("Neteisingas el. pašto formatas").escape(),
  body("password").trim().notEmpty().withMessage("Slaptažodis yra privalomas").isLength({ min: 6 }).withMessage("Slaptažodis turi būti bent 6 simboliai"),
  body("passwordConfirm").trim().notEmpty().withMessage("Patvirtinti slaptažodį").custom((value, { req }) => value === req.body.password).withMessage("Slaptažodiai nesutampa"),
  body("nickname").trim().notEmpty().withMessage("Slapyvardis yra privalomas").escape(),
];

export const register = async (req, res, next) => {
  try {
    // surenkame ir validuojame duomenis
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      res.status(400);
      return next({message: "Duomenų klaida", errors: validation.array()});
    }

    // surenkame validuotus duomenis iš užklausos
    const data = matchedData(req);

    // tikriname ar vartotojo el. paštas jau egzistuoja
    const existingEmail = await User.selectByEmail(data.email);
    if (existingEmail) {
      res.status(400);
      return next({message: "El. paštas jau užregistruotas"});
    }

    // tikriname ar slapyvardis jau naudojamas
    const existingNickname = await User.selectByNickname(data.nickname);
    if (existingNickname) {
      res.status(400);
      return next({message: "Slapyvardis jau naudojamas"});
    }

    // data.role = "user"; // numatytasis roleId registracijai

    // šifruojame slaptažodį
    data.password = await bcryptjs.hash(data.password, 10);

    // įterpiame naują vartotoją į DB
    let insertId = await User.insert(data);

    if (!insertId) {
      res.status(500);
      return next({message: "Nepavyko sukurti vartotojo. Patikrinkite duomenis ir bandykite dar kartą."});
    }

    // grąžiname vartotojo id
    res.status(201).json({
      status: "success",
      message: "Vartotojas užregistruotas",
      id: insertId,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500);
    return next({message: "Registracija nepavyko dėl serverio klaidos"});
  }
};

export const login = async (req, res, next) => {
  try {
    if (!hasJwtSecret) {
      res.status(500);
      return next({message: "Serverio konfigūracijos klaida: JWT_SECRET nėra nustatytas"});
    }

    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      res.status(400);
      return next({message: "Duomenų klaida", errors: validation.array()});
    }

    const data = matchedData(req);

    const user = await User.selectByEmail(data.email);
    if (!user) {
      res.status(401);
      return next({message: "Neteisingi prisijungimo duomenys"});
    }

    const match = await bcryptjs.compare(data.password, user.password);
    if (!match) {
      res.status(401);
      return next({message: "Neteisingi prisijungimo duomenys"});
    }

    // create JWT
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email,
      role: user.role 
    }, JWT_SECRET, { expiresIn: "1w" });

    // Log login activity
    const ipAddress = req.ip || req.connection.remoteAddress;
    await logActivity(user.id, user.email, 'LOGIN', null, null, 'User logged in successfully', ipAddress);

    // Return a minimal user object (do not include password)
    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ status: "success", user: safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500);
    return next({message: "Prisijungimas nepavyko dėl serverio klaidos"});
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: "El. paštas yra privalomas" });
    }

    const user = await User.selectByEmail(email);

    // Return generic response to avoid exposing whether account exists.
    if (!user) {
      return res.status(200).json({ message: "Jei paskyra egzistuoja, slaptažodžio keitimo instrukcijos bus išsiųstos el. paštu." });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (emailUser && emailPassword) {
      const { default: transporter } = await import("../utils/email.js");
      await transporter.sendMail({
        from: `Portfolio Support <${emailUser}>`,
        to: email,
        subject: "Password reset request",
        text: "Gavome jūsų slaptažodžio atkūrimo užklausą. Jei tai buvote jūs, susisiekite su administracija dėl slaptažodžio atstatymo.",
      });
    }

    return res.status(200).json({ message: "Jei paskyra egzistuoja, slaptažodžio keitimo instrukcijos bus išsiųstos el. paštu." });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(200).json({ message: "Jei paskyra egzistuoja, slaptažodžio keitimo instrukcijos bus išsiųstos el. paštu." });
  }
};
