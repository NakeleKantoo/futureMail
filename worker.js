import { db } from "./db.js";
import { transporter } from "./mailer.js";

function claimEmails(limit = 10) {
  const now = Date.now();

  const claim = db.prepare(`
    UPDATE emails
    SET status = 'processing'
    WHERE id IN (
      SELECT id FROM emails
      WHERE status = 'pending' AND send_at <= ?
      LIMIT ?
    )
    RETURNING *
  `);

  return claim.all(now, limit);
}

async function processEmail(email) {
  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
      to: email.to_email,
      subject: email.subject,
      text: email.body
    });

    db.prepare(`
      UPDATE emails
      SET status = 'sent', sent_at = ?
      WHERE id = ?
    `).run(Date.now(), email.id);

  } catch (err) {
    db.prepare(`
      UPDATE emails
      SET status = 'failed', error = ?
      WHERE id = ?
    `).run(err.message, email.id);
  }
}

async function tick() {
  const emails = claimEmails(10);
  for (const email of emails) {
    await processEmail(email);
  }
}

setInterval(tick, 5000);
console.log("Worker running (safe)");
