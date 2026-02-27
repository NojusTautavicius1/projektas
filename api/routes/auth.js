import express from "express";
const router = express.Router();

import * as userController from "../controllers/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET } = process.env;

// Vartotojo autentifikacija
router.post("/login", userController.authValidator(), userController.login);

// Vartotojo registracija
router.post("/register", userController.registerValidator(), userController.register);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: "1w" });
  const safeUser = {
    id: req.user.id,
    email: req.user.email,
    nickname: req.user.nickname,
    role: req.user.role,
  };
  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/auth-success?token=${token}&user=${JSON.stringify(safeUser)}`);
});

export default router;
