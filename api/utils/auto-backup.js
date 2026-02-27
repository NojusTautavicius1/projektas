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

const OUTPUT_FILE = path.join(__dirname, '..', 'database-full.sql');

let isBackingUp = false;

export async function autoBackup() {
  // Prevent concurrent backups
  if (isBackingUp) {
    console.log('⏳ Backup jau vykdomas, praleidžiama...');
    return;
  }

  try {
    isBackingUp = true;
    
    // Generate header
    const header = `-- Full Database Backup for Portfolio Project
-- Date: ${new Date().toISOString().split('T')[0]}
-- Database: ${DB_NAME}
-- Auto-generated backup

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Create Database
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`${DB_NAME}\`;

-- --------------------------------------------------------

`;

    // Build mysqldump command
    const passwordArg = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
    const portArg = DB_PORT !== '3306' ? `--port=${DB_PORT}` : '';
    
    // Try to find mysqldump in common locations
    const possiblePaths = [
      'mysqldump',
      'C:\\xampp\\mysql\\bin\\mysqldump.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe',
    ];
    
    let mysqldumpPath = null;
    for (const testPath of possiblePaths) {
      try {
        await execAsync(`"${testPath}" --version`);
        mysqldumpPath = testPath;
        break;
      } catch (err) {
        continue;
      }
    }
    
    if (!mysqldumpPath) {
      console.error('⚠️  mysqldump nerastas - backup praleistas');
      return;
    }
    
    const command = `"${mysqldumpPath}" -h ${DB_HOST} ${portArg} -u ${DB_USER} ${passwordArg} --no-create-db --skip-comments --skip-add-locks ${DB_NAME}`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('⚠️  Backup įspėjimas:', stderr);
    }
    
    // Write to file with header
    fs.writeFileSync(OUTPUT_FILE, header + stdout, 'utf8');
    
    console.log('💾 Auto-backup atliktas');
    
  } catch (error) {
    console.error('❌ Auto-backup klaida:', error.message);
  } finally {
    isBackingUp = false;
  }
}
