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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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