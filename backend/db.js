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
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
