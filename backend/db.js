
import 'dotenv/config';
import { createClient } from '@libsql/client';

// Shared online database (Turso) if keys are in backend/.env,
// otherwise a local file so the app still runs without keys.
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:jobs.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function setupDatabase() {
  await db.execute(`
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

  // Add new columns to an older jobs table if they are missing
  const info = await db.execute('PRAGMA table_info(jobs)');
  const existingColumns = info.rows.map((row) => row.name);

  for (const column of ['deadline', 'description', 'applicationLink']) {
    if (!existingColumns.includes(column)) {
      await db.execute(`ALTER TABLE jobs ADD COLUMN ${column} TEXT`);
    }
  }

  // Create a table for student accounts
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      cunySchool TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log(
    process.env.TURSO_DATABASE_URL
      ? 'Connected to shared Turso database'
      : 'Using local jobs.db (no Turso keys found in backend/.env)'
  );
}

export default db;
