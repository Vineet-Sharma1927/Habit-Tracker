'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function searchUsers(query: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  if (!query || query.length < 2) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
      id: { not: session.user.id },
    },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          habits: true,
          followers: true,
        },
      },
    },
    take: 20,
  });

  return users;
}

export async function followUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  if (session.user.id === targetUserId) {
    return { success: false, error: 'You cannot follow yourself' };
  }

  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return { success: false, error: 'You are already following this user' };
    }

    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    });

    revalidatePath('/dashboard/social');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to follow user' };
  }
}

export async function unfollowUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    revalidatePath('/dashboard/social');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to unfollow user' };
  }
}

export async function getFollowingStatus(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  return !!follow;
}

export async function getActivityFeed() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const followedUserIds = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  });

  const userIds = followedUserIds.map((f: { followingId: string }) => f.followingId);

  if (userIds.length === 0) {
    return [];
  }

  const completions = await prisma.habitCompletion.findMany({
    where: {
      habit: {
        userId: { in: userIds },
      },
    },
    include: {
      habit: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { date: 'desc' },
    take: 50,
  });

  return completions;
}

export async function getLeaderboard() {
  const users = await prisma.user.findMany({
    include: {
      habits: {
        select: {
          streak: true,
        },
      },
    },
  });

  const leaderboard = users
    .map((user: { id: string; name: string; email: string; habits: { streak: number }[] }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      totalStreak: user.habits.reduce((sum: number, habit: { streak: number }) => sum + habit.streak, 0),
      habitCount: user.habits.length,
    }))
    .sort((a: { totalStreak: number }, b: { totalStreak: number }) => b.totalStreak - a.totalStreak)
    .slice(0, 10);

  return leaderboard;
}
