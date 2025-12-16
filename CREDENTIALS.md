# Reviewer Credentials

## Login to the Application

**Email:** `reviewer@demo.com`  
**Password:** `Review123`

---

## How to Use

1. Visit the deployed application on Vercel (URL will be provided after deployment)
2. Click on "Login" in the navigation
3. Enter the credentials above
4. Explore the features:
   - View your dashboard
   - Create new habits
   - Mark habits as complete
   - View the leaderboard
   - Follow other users (search for: alice, bob, charlie, diana)
   - Check your social feed

---

## Other Test Users (for testing social features)

| Email | Password | Username |
|-------|----------|----------|
| testuser@habittracker.com | TestPass123! | Test User |
| demo@habittracker.com | DemoPass123! | Demo User |
| alice@habittracker.com | TestPass123! | Alice Johnson |
| bob@habittracker.com | TestPass123! | Bob Smith |
| charlie@habittracker.com | TestPass123! | Charlie Brown |
| diana@habittracker.com | TestPass123! | Diana Prince |

**Note:** These users already have habits and activity data for demonstration purposes.

---

## Production Database Setup

Before deployment to Vercel:

1. In Vercel dashboard, set the `DATABASE_URL` environment variable to your Neon database
2. Run the following commands to set up the production database:

```bash
# Push schema to production database
npx prisma db push --accept-data-loss

# Seed production database with test users
npx prisma db seed
```

This will create all necessary tables and seed the reviewer account along with other test users.
