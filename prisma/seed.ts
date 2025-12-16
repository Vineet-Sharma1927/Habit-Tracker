import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Define Frequency enum locally since it's not exported in Prisma v5
enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

async function main() {
  const hashedPassword = await bcrypt.hash('TestPass123!', 10);

  // Reviewer account with simple credentials
  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@demo.com' },
    update: {},
    create: {
      name: 'Reviewer',
      email: 'reviewer@demo.com',
      password: await bcrypt.hash('Review123', 10),
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'testuser@habittracker.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'testuser@habittracker.com',
      password: hashedPassword,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@habittracker.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@habittracker.com',
      password: await bcrypt.hash('DemoPass123!', 10),
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@habittracker.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@habittracker.com',
      password: await bcrypt.hash('TestPass123!', 10),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@habittracker.com' },
    update: {},
    create: {
      name: 'Bob Smith',
      email: 'bob@habittracker.com',
      password: await bcrypt.hash('TestPass123!', 10),
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@habittracker.com' },
    update: {},
    create: {
      name: 'Charlie Brown',
      email: 'charlie@habittracker.com',
      password: await bcrypt.hash('TestPass123!', 10),
    },
  });

  const diana = await prisma.user.upsert({
    where: { email: 'diana@habittracker.com' },
    update: {},
    create: {
      name: 'Diana Prince',
      email: 'diana@habittracker.com',
      password: await bcrypt.hash('TestPass123!', 10),
    },
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: testUser.id,
        followingId: demoUser.id,
      },
    },
    update: {},
    create: {
      followerId: testUser.id,
      followingId: demoUser.id,
    },
  });

  const exerciseHabit = await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: testUser.id,
        name: 'Morning Exercise',
      },
    },
    update: {},
    create: {
      name: 'Morning Exercise',
      category: 'Health',
      frequency: Frequency.DAILY,
      streak: 5,
      userId: testUser.id,
    },
  });

  const readingHabit = await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: testUser.id,
        name: 'Read Books',
      },
    },
    update: {},
    create: {
      name: 'Read Books',
      category: 'Education',
      frequency: Frequency.DAILY,
      streak: 12,
      userId: testUser.id,
    },
  });

  const meditationHabit = await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: testUser.id,
        name: 'Meditation',
      },
    },
    update: {},
    create: {
      name: 'Meditation',
      category: 'Wellness',
      frequency: Frequency.DAILY,
      streak: 3,
      userId: testUser.id,
    },
  });

  const weeklyReviewHabit = await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: testUser.id,
        name: 'Weekly Review',
      },
    },
    update: {},
    create: {
      name: 'Weekly Review',
      category: 'Productivity',
      frequency: Frequency.WEEKLY,
      streak: 8,
      userId: testUser.id,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 5; i++) {
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() - i);

    await prisma.habitCompletion.upsert({
      where: {
        id: `${exerciseHabit.id}-${i}`,
      },
      update: {},
      create: {
        id: `${exerciseHabit.id}-${i}`,
        habitId: exerciseHabit.id,
        date: completionDate,
        notes: i === 0 ? 'Great workout today!' : null,
      },
    });
  }

  for (let i = 0; i < 12; i++) {
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() - i);

    await prisma.habitCompletion.upsert({
      where: {
        id: `${readingHabit.id}-${i}`,
      },
      update: {},
      create: {
        id: `${readingHabit.id}-${i}`,
        habitId: readingHabit.id,
        date: completionDate,
        notes: i === 0 ? 'Finished chapter 5' : null,
      },
    });
  }

  await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: demoUser.id,
        name: 'Yoga',
      },
    },
    update: {},
    create: {
      name: 'Yoga',
      category: 'Health',
      frequency: Frequency.WEEKLY,
      streak: 0,
      userId: demoUser.id,
    },
  });

  const aliceRunning = await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: alice.id,
        name: 'Running',
      },
    },
    update: {},
    create: {
      name: 'Running',
      category: 'Fitness',
      frequency: Frequency.DAILY,
      streak: 15,
      userId: alice.id,
    },
  });

  await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: alice.id,
        name: 'Journaling',
      },
    },
    update: {},
    create: {
      name: 'Journaling',
      category: 'Productivity',
      frequency: Frequency.DAILY,
      streak: 8,
      userId: alice.id,
    },
  });

  await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: bob.id,
        name: 'Coding Practice',
      },
    },
    update: {},
    create: {
      name: 'Coding Practice',
      category: 'Learning',
      frequency: Frequency.DAILY,
      streak: 20,
      userId: bob.id,
    },
  });

  await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: charlie.id,
        name: 'Guitar Practice',
      },
    },
    update: {},
    create: {
      name: 'Guitar Practice',
      category: 'Hobbies',
      frequency: Frequency.DAILY,
      streak: 10,
      userId: charlie.id,
    },
  });

  await prisma.habit.upsert({
    where: {
      userId_name: {
        userId: diana.id,
        name: 'Painting',
      },
    },
    update: {},
    create: {
      name: 'Painting',
      category: 'Art',
      frequency: Frequency.WEEKLY,
      streak: 6,
      userId: diana.id,
    },
  });

  for (let i = 0; i < 15; i++) {
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() - i);

    await prisma.habitCompletion.create({
      data: {
        habitId: aliceRunning.id,
        date: completionDate,
        notes: i === 0 ? '5km run completed!' : i === 3 ? 'New personal best!' : null,
      },
    });
  }

  console.log('Database seeded successfully');
  console.log('');
  console.log('=== REVIEWER CREDENTIALS ===');
  console.log('Email: reviewer@demo.com');
  console.log('Password: Review123');
  console.log('');
  console.log('Other Test Users:');
  console.log('Test User:', testUser.email, '- Password: TestPass123!');
  console.log('Demo User:', demoUser.email, '- Password: DemoPass123!');
  console.log('Alice:', alice.email, '- Password: TestPass123!');
  console.log('Bob:', bob.email, '- Password: TestPass123!');
  console.log('Charlie:', charlie.email, '- Password: TestPass123!');
  console.log('Diana:', diana.email, '- Password: TestPass123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

