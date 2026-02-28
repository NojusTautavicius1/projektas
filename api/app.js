import express from 'express';
import path from 'path';
import indexRouter from './routes/index.js';
import cors from 'cors';
import helmet from 'helmet';
import { log } from 'console';

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to allow inline scripts
  crossOriginEmbedderPolicy: false
}));

// CORS nustatymai
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:81', 'http://127.0.0.1:81'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __dirname = path.resolve();
const publicPath = process.env.VERCEL ? path.join(__dirname, 'api/public') : path.join(__dirname, 'public');
const frontDistPath = process.env.VERCEL ? path.join(__dirname, 'front/dist') : path.join(__dirname, '../front/dist');

app.use(express.static(publicPath));

// Serve frontend static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontDistPath));
}

app.use('/', indexRouter);

// Serve frontend for any non-API routes (SPA fallback)
app.get('*', function(req, res, next) {
  if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
    return next();
  }
  if (process.env.NODE_ENV === 'production') {
    const indexPath = process.env.VERCEL ? path.join(__dirname, 'front/dist/index.html') : path.join(__dirname, '../front/dist/index.html');
    res.sendFile(indexPath);
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  res.status(404);
  next({message: 'Puslapis nerastas'});
});

app.use(function(err, req, res, next) {
  if (!res.statusCode || res.statusCode === 200) {
    res.status(500);
  }

  if (typeof err === 'object' && !Array.isArray(err)) 
    res.json(err);
  else  
    res.json({message: 'Serverio klaida'});
});

export default app;