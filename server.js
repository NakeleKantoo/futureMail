import express from "express";
import { db } from "./db.js";
import "dotenv/config";

const app = express();
app.use(express.json());

app.post("/schedule", (req, res) => {
  const { to, subject, body, sendAt } = req.body;

  if (!to || !body || !sendAt) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const ts = new Date(sendAt).getTime();
  if (isNaN(ts)) {
    return res.status(400).json({ error: "Invalid date" });
  }

  const stmt = db.prepare(`
    INSERT INTO emails (to_email, subject, body, send_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    to,
    subject ?? "Scheduled Message",
    body,
    ts,
    Date.now()
  );

  res.json({ id: info.lastInsertRowid });
});

app.get("/emails", (_, res) => {
  const rows = db.prepare("SELECT * FROM emails ORDER BY created_at DESC").all();
  res.json(rows);
});

console.log("Usando as credenciais: ")
console.log({
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PORT: process.env.MAIL_PORT
});

app.listen(process.env.port, () => console.log(`API on localhost:${process.env.port}`));
