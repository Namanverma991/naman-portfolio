import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'portfolio.db');

// Ensure db directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Set pragmas for performance and concurrent safety
try {
  db.pragma('journal_mode = WAL');
} catch (e) {
  // Ignore WAL error on read-only environments
}
db.pragma('foreign_keys = ON');

// Run migrations/schema setup
try {
  const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);

    // Auto-seed admin user if admin_users table is empty
    const userCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get()?.count || 0;
    if (userCount === 0) {
      const email = process.env.ADMIN_EMAIL || 'nnamanvverma@gmail.com';
      const password = process.env.ADMIN_PASSWORD || 'changeme123';
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      db.prepare(`
        INSERT OR IGNORE INTO admin_users (email, password)
        VALUES (?, ?)
      `).run(email, hashedPassword);
    }
  } else {
    console.warn('Schema SQL file not found at:', schemaPath);
  }
} catch (error) {
  console.error('Failed to initialize database schema:', error);
}

export default db;

