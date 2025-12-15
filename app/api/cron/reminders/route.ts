import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBulkReminderEmails } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Optional: Add a secret token for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all daily habits that haven't been checked in today
    const habits = await prisma.habit.findMany({
      where: {
        frequency: 'DAILY',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        completions: {
          where: {
            date: {
              gte: today,
            },
          },
          take: 1,
        },
      },
    });

    // Filter habits that have no completion today
    const habitsNeedingReminder = habits.filter(
      (habit: { completions: unknown[] }) => habit.completions.length === 0
    );

    if (habitsNeedingReminder.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No reminders needed',
        count: 0,
        reminders: [],
      });
    }

    // Group habits by user to avoid sending multiple emails
    const userHabitsMap = new Map<string, { email: string; habits: string[] }>();

    for (const habit of habitsNeedingReminder) {
      const userEmail = habit.user.email;
      if (!userHabitsMap.has(userEmail)) {
        userHabitsMap.set(userEmail, {
          email: userEmail,
          habits: [],
        });
      }
      userHabitsMap.get(userEmail)!.habits.push(habit.name);
    }

    // Send reminders (one email per user with all their pending habits)
    const reminders: { email: string; habitName: string }[] = [];
    
    for (const [, userData] of userHabitsMap) {
      // For simplicity, send one email per habit
      // In production, you might want to combine all habits into one email
      for (const habitName of userData.habits) {
        reminders.push({
          email: userData.email,
          habitName,
        });
      }
    }

    const results = await sendBulkReminderEmails(reminders);

    return NextResponse.json({
      success: true,
      message: `Sent ${results.length} reminder(s)`,
      count: results.length,
      reminders: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing reminders:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for cron services that prefer POST
export async function POST(request: NextRequest) {
  return GET(request);
}
