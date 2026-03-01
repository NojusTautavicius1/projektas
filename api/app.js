import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();

// Get proper __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to allow inline scripts
  crossOriginEmbedderPolicy: false
}));

// CORS nustatymai
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL, 'https://projektas-bj2p.vercel.app']
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:81', 'http://127.0.0.1:81'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(process.env.FRONTEND_URL)) {
      return callback(null, true);
    } else {
      return callback(null, true); // Allow all in production for now
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve public folder
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filepath) => {
      if (filepath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (filepath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
    }
  }));
}

// Serve frontend static files if they exist
const frontDistPath = path.join(__dirname, '../front/dist');
if (fs.existsSync(frontDistPath)) {
  app.use(express.static(frontDistPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filepath) => {
      if (filepath.endsWith('.html')) {
        // Don't cache HTML files
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (filepath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filepath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
}
    }
  }));
}

app.use('/', indexRouter);

// Serve frontend for any non-API routes (SPA fallback)
app.use(function(req, res, next) {
  // Skip API and image routes
  if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
    return next();
  }
  
  // Try to serve frontend index.html
  const indexPath = path.join(__dirname, '../front/dist/index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // If no frontend, continue to 404 handler
  next();
});

app.use(function(req, res, next) {
  res.status(404);
  next({message: 'Puslapis nerastas'});
});

app.use(function(err, req, res, next) {
  console.error('Error:', err);
  
  if (!res.statusCode || res.statusCode === 200) {
    res.status(500);
  }

  if (typeof err === 'object' && !Array.isArray(err)) 
    res.json(err);
  else  
    res.json({message: 'Serverio klaida', error: err.message || err});
});

export default app;