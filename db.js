import Database from "better-sqlite3";

export const db = new Database("emails.db");

db.exec(`
CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to_email TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  send_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  sent_at INTEGER,
  created_at INTEGER NOT NULL
);
`);
