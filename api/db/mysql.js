import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load .env file only if it exists (for local development)
try {
  dotenv.config();
} catch (error) {
  console.log('No .env file found, using environment variables');
}

// Validate required environment variables
const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE', 'MYSQL_PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
}

console.log('Database config:', {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

// Create the connection pool. The pool-specific settings are the defaults
export default mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,

  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 20, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 20000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});