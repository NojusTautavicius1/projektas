import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importDatabase() {
  const connection = await mysql.createConnection({
    host: 'mag1ev.proxy.railway.net',
    port: 50237,
    user: 'root',
    password: 'lWBQCcZMcqtXSQVILdWEAuspQvHATIEx',
    database: 'railway',
    multipleStatements: true,
    connectTimeout: 60000,
    ssl: { rejectUnauthorized: false }
  });

  console.log('✅ Connected to Railway MySQL');

  const sqlFile = path.join(__dirname, '..', 'database-railway.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  console.log('📥 Importing database...');
  
  try {
    await connection.query(sql);
    console.log('✅ Database imported successfully!');
    console.log('\n📊 Tables created:');
    const [tables] = await connection.query('SHOW TABLES');
    tables.forEach(table => {
      console.log('  - ' + Object.values(table)[0]);
    });
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await connection.end();
  }
}

importDatabase().catch(console.error);
