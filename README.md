# Habit Tracker Web App

A full-stack habit tracking application built with Next.js, TypeScript, PostgreSQL, and Prisma ORM.

## 🚀 Deployed Application

**Live URL**: [Your Vercel App URL]

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

### 3. Setup Production Database

After deployment, run these commands locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables from Vercel
vercel env pull .env.production

# Create database tables
npx prisma db push

# Seed with test users including reviewer account
npx prisma db seed
```

Your application is now deployed and ready to use!

---

## License

MIT


