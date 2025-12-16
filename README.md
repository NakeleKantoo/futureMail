# FutureMail

Small Node.js service to schedule emails and send them later using a SMTP server.

## Features
- Schedule emails for a future time
- SQLite database (persistent)
- Stores sent and failed emails
- Has a password system as to not get abused by the internet

## Setup

Install dependencies:
```bash
npm install
```

## Create a .env file:

```env
MAIL_HOST=mail.yourdomain.tld
MAIL_PORT=587
MAIL_USER=you@yourdomain.tld
MAIL_PASS=your_password
MAIL_FROM_NAME=Scheduler
port=3000
sendpass=your_very_goddamn_secure_password_please_i_beg_of_you_make_this_secure
```

## Run

Start API and worker together:

```
npm run dev
```

# API

Schedule an email:

`POST /schedule`

#### Body:
```
{
  "to": "user@example.com",
  "subject": "Hello",
  "body": "This was scheduled",
  "sendAt": "2025-12-20T14:00:00Z",
  "pass": "password-to-send"
}
```

List all emails:

`GET /emails`

### Notes

- MAIL_USER must match the sender address

- Uses SQLite file emails.db