'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type Frequency = 'DAILY' | 'WEEKLY';

const createHabitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  category: z.string().min(2, 'Category must be at least 2 characters').max(50),
  frequency: z.enum(['DAILY', 'WEEKLY']),
});

export async function createHabit(data: {
  name: string;
  category: string;
  frequency: Frequency;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const validatedData = createHabitSchema.parse(data);

    const habit = await prisma.habit.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        frequency: validatedData.frequency,
        userId: session.user.id,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, habit };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    if ((error as any).code === 'P2002') {
      return { success: false, error: 'You already have a habit with this name' };
    }

    return { success: false, error: 'Failed to create habit' };
  }
}

export async function checkInHabit(habitId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      include: { completions: true },
    });

    if (!habit || habit.userId !== session.user.id) {
      return { success: false, error: 'Habit not found' };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let alreadyCheckedIn = false;

    if (habit.frequency === 'DAILY') {
      alreadyCheckedIn = habit.completions.some((completion: any) => {
        const completionDate = new Date(completion.date);
        return (
          completionDate.getFullYear() === today.getFullYear() &&
          completionDate.getMonth() === today.getMonth() &&
          completionDate.getDate() === today.getDate()
        );
      });
    } else {
      const weekNumber = getISOWeek(now);
      const year = now.getFullYear();

      alreadyCheckedIn = habit.completions.some((completion: any) => {
        const completionDate = new Date(completion.date);
        return (
          getISOWeek(completionDate) === weekNumber &&
          completionDate.getFullYear() === year
        );
      });
    }

    if (alreadyCheckedIn) {
      return {
        success: false,
        error: `Already checked in for this ${habit.frequency.toLowerCase()} period`,
      };
    }

    await prisma.$transaction([
      prisma.habitCompletion.create({
        data: {
          habitId: habit.id,
          date: now,
        },
      }),
      prisma.habit.update({
        where: { id: habit.id },
        data: { streak: { increment: 1 } },
      }),
    ]);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to check in' };
  }
}

export async function deleteHabit(habitId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== session.user.id) {
      return { success: false, error: 'Habit not found' };
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete habit' };
  }
}

export async function getUserHabits(category?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const habits = await prisma.habit.findMany({
    where: {
      userId: session.user.id,
      ...(category && category !== 'all' ? { category } : {}),
    },
    include: {
      completions: {
        orderBy: { date: 'desc' },
        take: 30,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return habits;
}

function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}
