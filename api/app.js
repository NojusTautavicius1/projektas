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

// CORS nustatymai: allow both production domain and local admin/frontend dev origins.
const localOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:81',
  'http://127.0.0.1:81',
];

const productionOrigins = [
  process.env.FRONTEND_URL,
  'https://ntdev.lt',
  'https://www.ntdev.lt',
  'https://projektas-bj2p.vercel.app',
].filter(Boolean);

const allowedOrigins = [...new Set([...localOrigins, ...productionOrigins])];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (curl/postman/server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve public folder
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Serve frontend static files if they exist
const frontDistPath = path.join(__dirname, '../front/dist');
if (fs.existsSync(frontDistPath)) {
  app.use(express.static(frontDistPath));
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

// Start server when running this file directly (npm run dev / npm start).
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

export default app;