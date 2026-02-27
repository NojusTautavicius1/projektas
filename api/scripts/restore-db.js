import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_HOST = process.env.MYSQL_HOST || 'localhost';
const DB_PORT = process.env.MYSQL_PORT || '3306';
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || 'projects';

const INPUT_FILE = path.join(__dirname, '..', 'database-full.sql');

async function restoreDatabase() {
  try {
    console.log('🔄 Pradedamas duomenų bazės atkūrimas...');
    
    // Check if backup file exists
    if (!fs.existsSync(INPUT_FILE)) {
      throw new Error(`Backup failas nerastas: ${INPUT_FILE}`);
    }
    
    // Try to find mysql in common locations
    const possiblePaths = [
      'mysql', // System PATH
      'C:\\xampp\\mysql\\bin\\mysql.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysql.exe',
    ];
    
    let mysqlPath = null;
    for (const testPath of possiblePaths) {
      try {
        await execAsync(`"${testPath}" --version`);
        mysqlPath = testPath;
        break;
      } catch (err) {
        continue;
      }
    }
    
    if (!mysqlPath) {
      throw new Error('mysql nerastas. Įsitikinkite, kad MySQL įdiegtas arba naudokite XAMPP.');
    }
    
    console.log(`📦 Naudojamas: ${mysqlPath}`);
    console.log(`📁 Atkuriamas failas: ${INPUT_FILE}`);
    
    const passwordArg = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
    const portArg = DB_PORT !== '3306' ? `--port=${DB_PORT}` : '';
    
    const command = `"${mysqlPath}" -h ${DB_HOST} ${portArg} -u ${DB_USER} ${passwordArg} < "${INPUT_FILE}"`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('⚠️  Įspėjimas:', stderr);
    }
    
    console.log('✅ Duomenų bazė sėkmingai atkurta!');
    console.log(`📊 Duomenų bazė: ${DB_NAME}`);
    
  } catch (error) {
    console.error('❌ Klaida atkuriant duomenų bazę:');
    console.error(error.message);
    
    if (error.message.includes('Access denied')) {
      console.error('\n🔑 Patikrinkite .env faile:');
      console.error('   - MYSQL_USER');
      console.error('   - MYSQL_PASSWORD');
      console.error('   - MYSQL_PORT');
    }
    
    process.exit(1);
  }
}

restoreDatabase();
