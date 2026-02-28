import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  if (req.method !== 'POST' || req.headers['x-secret-key'] !== process.env.JWT_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      multipleStatements: true,
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connected to Railway MySQL');

    const sqlFile = path.join(__dirname, '..', '..', 'api', 'database-railway.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📥 Importing database...');
    
    await connection.query(sql);
    
    const [tables] = await connection.query('SHOW TABLES');
    await connection.end();

    return res.json({ 
      success: true, 
      message: 'Database imported successfully',
      tables: tables.map(t => Object.values(t)[0])
    });
  } catch (error) {
    console.error('❌ Import failed:', error);
    return res.status(500).json({ error: error.message });
  }
}
