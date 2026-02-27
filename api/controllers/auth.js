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

if (!JWT_SECRET) throw new Error({message: "JWT_SECRET nėra nustatytas .env faile!"});

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

  // data.role = "user"; // numatytasis roleId registracijai

  // šifruojame slaptažodį
  data.password = await bcryptjs.hash(data.password, 10);

  // įterpiame naują vartotoją į DB
  let insertId = await User.insert(data);

  if (!insertId) {
    res.status(500);
    return next({message: "Nepavyko sukurti vartotojo"});
  }

  // grąžiname vartotojo id
  res.status(201).json({
    status: "success",
    message: "Vartotojas užregistruotas",
    id: insertId,
  });
};

export const login = async (req, res, next) => {
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
};
