# Habit Tracker Web App

A full-stack habit tracking application built with Next.js, TypeScript, PostgreSQL, and Prisma ORM.

## 🚀 Deployed Application

**Live URL**: [https://habit-tracker-flax-eight.vercel.app/](https://habit-tracker-flax-eight.vercel.app/)

## 🔑 Login Credentials

Use these credentials to test the application:

**Email:** `reviewer@demo.com`  
**Password:** `Review123`

## Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Neon for production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Deployment**: Vercel

## Features

- ✅ User Authentication (Signup/Login)
- ✅ Create and manage habits (Daily/Weekly frequency)
- ✅ Check-in system with streak tracking
- ✅ Social features (Follow users, activity feed)
- ✅ Leaderboard with top performers
- ✅ Email reminders for pending habits
- ✅ Responsive design

## Prerequisites

- Node.js 20+
- Docker Desktop (for local development)
- npm or yarn

## Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd habit-tracker
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://habituser:habitpass123@localhost:5433/habittracker"
POSTGRES_USER=habituser
POSTGRES_PASSWORD=habitpass123
POSTGRES_DB=habittracker

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Email (Optional - uses mock mode if not configured)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Habit Tracker <noreply@habittracker.com>"
```

### 3. Start PostgreSQL Database

```bash
npm run docker:db:up
```

### 4. Setup Database Schema

```bash
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and login with the credentials above.

## Email Reminders

The application includes an automated email reminder system for users with pending daily habits.

### How It Works

- Sends email reminders to users who have DAILY habits that haven't been checked in today
- Runs via a cron job endpoint at `/api/cron/reminders`
- Supports three modes: Mock (console log), Ethereal (test emails), and SMTP (real emails)

### Configuration

**1. Mock Mode (Default - No Configuration Needed)**
- Emails are logged to console only
- Perfect for development and testing
- No SMTP credentials required

**2. SMTP Mode (Production Email)**

Add these variables to your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Habit Tracker <noreply@habittracker.com>"
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the App Password as `SMTP_PASS`

### Manual Testing

Test the reminder system manually:

```bash
# Local development
curl http://localhost:3000/api/cron/reminders

# Production
curl https://your-app.vercel.app/api/cron/reminders
```

### Automated Scheduling (Production)

**Option 1: Vercel Cron (Recommended)**

Create `vercel.json` in project root:

```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 8 * * *"
  }]
}
```

This runs daily at 8:00 AM UTC. Redeploy to Vercel after adding this file.

**Option 2: External Cron Services**

Use services like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)

Configure them to call: `https://your-app.vercel.app/api/cron/reminders`

## Environment Variables

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://habituser:habitpass123@localhost:5433/habittracker` (local)<br>`postgresql://user:pass@host/db` (production) |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` (dev)<br>`https://your-app.vercel.app` (prod) |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Generate with: `openssl rand -base64 32` |

### Optional Variables (Email Reminders)

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | Uses mock mode if not set |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username/email | None |
| `SMTP_PASS` | SMTP password | None |
| `SMTP_FROM` | Sender email address | `"Habit Tracker <noreply@habittracker.com>"` |

### Optional Variables (Local Development)

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `habituser` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `habitpass123` |
| `POSTGRES_DB` | PostgreSQL database name | `habittracker` |

The PostgreSQL container uses:
- **User**: `habituser`
- **Password**: `habitpass123`
- **Database**: `habittracker`
- **Port**: `5433` (host) → `5432` (container)
- **Volume**: `habit-tracker-postgres-data`

## Production Deployment

The Dockerfile implements a multi-stage build:
1. **deps**: Install dependencies
2. **builder**: Build Next.js app
3. **runner**: Minimal runtime image

Build size is optimized using standalone output mode.

### Using Docker Compose

Run the entire stack (database + application):

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL on port 5433
## Deployment to Vercel

### 1. Setup Neon Database

- Sign up at [Neon](https://neon.tech/) (free tier available)
- Create a new PostgreSQL database
- Copy the connection string

### 2. Deploy to Vercel

- Visit [vercel.com](https://vercel.com) and import your GitHub repository
- Configure environment variables in Vercel dashboard:
  - `DATABASE_URL` - Your Neon database connection string
  - `NEXTAUTH_URL` - Your Vercel domain (e.g., `https://your-app.vercel.app`)
  - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
  - Optional: SMTP variables for email notifications

### 3. Setup Production Database (One-Time Only)

**Note:** This step is only needed once during initial deployment. The database and data persist across all future redeployments.

After first deployment, run these commands locally:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Pull environment variables from Vercel
vercel env pull .env.production

# Create database tables (one-time)
npx prisma db push

# Seed with test users including reviewer account (one-time)
npx prisma db seed
```

Your application is now deployed and ready to use!

**For subsequent deployments:** Just push your code changes to GitHub. Vercel will automatically redeploy. No database setup needed.

---

## License

MIT


