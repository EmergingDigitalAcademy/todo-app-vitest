import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Create a test database connection
export async function getTestDb() {
  return open({
    filename: ':memory:', // Use in-memory database for tests
    driver: sqlite3.Database
  });
}

// Initialize test database schema
export async function initTestDb(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')) NOT NULL,
      due_date TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
} 