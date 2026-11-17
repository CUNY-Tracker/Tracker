import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'jobs.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    postedBy TEXT DEFAULT 'student',
    deadline TEXT,
    description TEXT,
    applicationLink TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// If someone already has an old jobs.db, add the new columns to it
const existingColumns = db
  .prepare('PRAGMA table_info(jobs)')
  .all()
  .map((column) => column.name);

for (const column of ['deadline', 'description', 'applicationLink']) {
  if (!existingColumns.includes(column)) {
    db.exec(`ALTER TABLE jobs ADD COLUMN ${column} TEXT`);
  }
}

export default db;