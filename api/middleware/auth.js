import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Middleware to verify JWT token and attach user to request
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      return next({ message: "Neautorizuotas. Trūksta token." });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401);
      return next({ message: "Neteisingas token" });
    } else if (err.name === 'TokenExpiredError') {
      res.status(401);
      return next({ message: "Token pasibaigė" });
    }
    
    res.status(401);
    return next({ message: "Autentifikacijos klaida" });
  }
};

// Middleware to check if user is an admin
export const adminOnly = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    res.status(401);
    return next({ message: "Neautorizuotas" });
  }
  
  // Check if user has admin role
  if (req.user.role !== 'admin') {
    res.status(403);
    return next({ message: "Prieiga uždrausta. Reikalingos administratoriaus teisės" });
  }
  
  next();
};

// Middleware to check if user is an admin (OLD - deprecated, use adminOnly)
export const requireAdmin = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    res.status(401);
    return next({ message: "Neautorizuotas" });
  }
  
  // Check if user has admin role
  if (req.user.role !== 'admin') {
    res.status(403);
    return next({ message: "Prieiga uždrausta. Reikalingos administratoriaus teisės" });
  }
  
  next();
};

// Middleware to check if user is authenticated (OLD - deprecated, use authenticate)
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next({ message: "Neautorizuotas" });
  }
  
  next();
};
