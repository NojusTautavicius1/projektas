import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

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