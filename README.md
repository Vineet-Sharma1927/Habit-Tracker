# Habit Tracker Web App

A full-stack habit tracking application built with Next.js, TypeScript, PostgreSQL, and Docker.

## 🚀 Live Demo

**Deployed URL**: [Coming Soon / Your Deployment URL Here]

> **Note**: Update this section with your actual deployment URL after deploying to Vercel, Railway, or other platforms.

## Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 20+
- Docker Desktop (running)
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:. See [Environment Variables](#environment-variables) section below for details.

### 3. Database Setup

Run Prisma migrations and seed the database:

```bash
npm run db:migrate
npm run db:seed
```

### 4sh
cp .env.example .env
```
5
Update `.env` with your configuration if needed.

### 3. Start PostgreSQL Database

```bash
npm run docker:db:up
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

All environment variables should be configured in a `.env` file at the root of the project. Copy `.env.example` to get started.

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://habituser:habitpass123@localhost:5433/habittracker` |
| `POSTGRES_USER` | PostgreSQL username | `habituser` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `habitpass123` |
| `POSTGRES_DB` | PostgreSQL database name | `habittracker` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` (dev) / `https://yourdomain.com` (prod) |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js (min 32 chars) | Generate with `openssl rand -base64 32` |

### Optional Variables (Email Service)

| Variable | Description | Default | Example Value |
|----------|-------------|---------|---------------|
| `SMTP_HOST` | SMTP server hostname | None (uses mock mode) | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` | `587` |
| `SMTP_USER` | SMTP username/email | None | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/app password | None | `your-app-password` |
| `SMTP_FROM` | Sender email address | `"Habit Tracker <noreply@habittracker.com>"` | Custom sender |
| `SMTP_SECURE` | Use TLS/SSL | `false` | `true` or `false` |

### Optional Variables (Security)

| Variable | Description | Default | Example Value |
|----------|-------------|---------|---------------|
| `CRON_SECRET` | Secret token for cron endpoint | None (no auth) | Any secure random string |

### Environment Variable Notes

- **Development**: Use `localhost:5433` for `DATABASE_URL` (port mapping from docker-compose)
- **Docker Production**: Use `postgres:5432` for internal container communication
- **Vercel/Cloud**: Use your cloud database URL (e.g., Neon, Supabase, Railway)
- **NEXTAUTH_SECRET**: Generate a secure random string:
  ```bash
  openssl rand -base64 32
  ```
- **Email Service**: Leave SMTP variables empty to use mock mode (logs to console)

## Test User Credentials

### Main Test User
**Email**: `testuser@habittracker.com`  
**Password**: `TestPass123!`

### Additional Demo Users
**Email**: `demo@habittracker.com` | **Password**: `DemoPass123!`  
**Email**: `alice@habittracker.com` | **Password**: `TestPass123!`  
**Email**: `bob@habittracker.com` | **Password**: `TestPass123!`  
**Email**: `charlie@habittracker.com` | **Password**: `TestPass123!`  
**Email**: `diana@habittracker.com` | **Password**: `TestPass123!`

## Available Scripts

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed database with test users
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma Client

### Docker - Database
- `npm run docker:db:up` - Start PostgreSQL container
- `npm run docker:db:down` - Stop PostgreSQL container
- `npm run docker:db:reset` - Reset database (removes volume)

### Docker - Application
- `npm run docker:build` - Build production Docker image
- `npm run docker:run` - Run containerized application
- `docker-compose up -d` - Start all services (database + app)

## Docker Production Build

Build and run the application in a container:

```bash
npm run docker:build
npm run docker:run
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
habit-tracker/
├── app/                 # Next.js App Router pages
├── public/              # Static assets
├── docker-compose.yml   # PostgreSQL service definition
├── Dockerfile           # Multi-stage production build
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## Database Configuration

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
- Build and start the Next.js app on port 3000
- Create a bridge network for internal communication
- Use the internal DNS name `postgres` for database connection

Access the app at [http://localhost:3000](http://localhost:3000).

## Email Notifications & Reminders

The app includes an email notification system for habit reminders.

### Email Modes

1. **Mock Mode** (Default): Logs emails to console
2. **Ethereal Mode**: Uses ethereal.email test accounts (auto-created)
3. **SMTP Mode**: Configure your own SMTP server in `.env`

### Email Configuration

To use a real SMTP server, add to your `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Habit Tracker <noreply@habittracker.com>"
SMTP_SECURE=false
```

### Manual Cron Trigger

The reminder system is available via API route for manual testing:

```bash
# Without authentication
curl http://localhost:3000/api/cron/reminders

# With CRON_SECRET (if configured in .env)
curl -H "Authorization: Bearer your-secret-token" \
  http://localhost:3000/api/cron/reminders
```

**What it does:**
- Finds all users with DAILY habits
- Checks if they haven't completed check-ins today
- Sends reminder emails for pending habits
- Returns a JSON response with results

**Response Example:**

```json
{
  "success": true,
  "message": "Sent 3 reminder(s)",
  "count": 3,
  "reminders": [
    {

## Deployment

### Deploying to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Configure Database**:
   - Use [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/) for PostgreSQL
   - Copy your database connection string

3. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com) and import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `DATABASE_URL` - Your cloud database URL
     - `NEXTAUTH_URL` - Your Vercel domain (e.g., `https://your-app.vercel.app`)
     - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
     - Optional: Add SMTP variables for email notifications
   
4. **Run Database Migrations**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Run migration command
   vercel env pull .env.local
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Configure Cron** (Optional):
   
   Create `vercel.json` in project root:
   ```json
   {
     "crons": [{
       "path": "/api/cron/reminders",
       "schedule": "0 8 * * *"
     }]
   }
   ```

### Deploying to Railway

1. **Create New Project** on [railway.app](https://railway.app)

2. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create `DATABASE_URL`

3. **Deploy Application**:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Railway will auto-detect Next.js

4. **Configure Environment Variables**:
   - `NEXTAUTH_URL` - Your Railway domain
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - Optional: Add SMTP variables

5. **Run Database Setup**:
   ```bash
   railway run npx prisma migrate deploy
   railway run npx prisma db seed
   ```

### Deploying with Docker

For self-hosting or cloud VPS deployment:

```bash
# Build and run with docker-compose
docker-compose up -d

# Access at http://your-server-ip:3000
```

**Important**: Update `DATABASE_URL` in `.env` to use `postgres:5432` (internal Docker DNS) instead of `localhost:5433`.

### Post-Deployment Checklist

- [ ] Update `NEXTAUTH_URL` to match your deployed domain
- [ ] Set a secure `NEXTAUTH_SECRET`
- [ ] Run `prisma migrate deploy` on production database
- [ ] Run `prisma db seed` to create test users
- [ ] Test authentication flow
- [ ] Configure SMTP for production emails (or keep mock mode)
- [ ] Set up cron job for daily reminders (Vercel cron, GitHub Actions, etc.)
- [ ] Update README with deployed URL

## License

MIT
      "email": "testuser@habittracker.com",
      "habitName": "Morning Exercise",
      "success": true,
      "mode": "mock"
    }
  ],
  "timestamp": "2025-12-15T10:30:00.000Z"
}
```

### Production Cron Setup

For production, schedule this endpoint with:
- **Vercel Cron**: Add to `vercel.json`
- **GitHub Actions**: Scheduled workflow
- **External Services**: Cron-job.org, EasyCron, etc.

Example with `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 8 * * *"
  }]
}
```

This runs daily at 8:00 AM UTC.

## Features

- ✅ User Authentication (NextAuth.js)
- ✅ Habit Creation & Management (CRUD)
- ✅ Daily & Weekly Habit Tracking
- ✅ Check-in System with Streak Tracking
- ✅ Category Filtering
- ✅ Social Features (Follow/Unfollow)
- ✅ Activity Feed
- ✅ Leaderboard (Top Users by Streak)
- ✅ Email Reminders (Mock/Ethereal/SMTP)
- ✅ Docker & Docker Compose Support
- ✅ Production-Ready Build


