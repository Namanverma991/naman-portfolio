import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'portfolio.db');

// Ensure db directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Set pragmas for performance and concurrent safety
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Run migrations/schema setup
try {
  const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
  } else {
    console.warn('Schema SQL file not found at:', schemaPath);
  }
} catch (error) {
  console.error('Failed to initialize database schema:', error);
}

export default db;
