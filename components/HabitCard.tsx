'use client';

import { useState } from 'react';
import { checkInHabit, deleteHabit } from '@/app/actions/habits';

type Frequency = 'DAILY' | 'WEEKLY';

type HabitWithCompletions = any;

export default function HabitCard({ habit }: { habit: HabitWithCompletions }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [error, setError] = useState('');

  const isCheckedInToday = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (habit.frequency === 'DAILY') {
      return habit.completions.some((completion: any) => {
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

      return habit.completions.some((completion: any) => {
        const completionDate = new Date(completion.date);
        return (
          getISOWeek(completionDate) === weekNumber &&
          completionDate.getFullYear() === year
        );
      });
    }
  };

  const handleCheckIn = async () => {
    setError('');
    setIsCheckingIn(true);

    try {
      const result = await checkInHabit(habit.id);
      if (!result.success) {
        setError(result.error || 'Failed to check in');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this habit?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteHabit(habit.id);
      if (!result.success) {
        alert(result.error || 'Failed to delete habit');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const checkedIn = isCheckedInToday();

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{habit.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
              {habit.category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
              {habit.frequency}
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
          title="Delete habit"
        >
          {isDeleting ? '...' : '🗑️'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-gray-900">{habit.streak}</span>
          <span className="text-gray-600">
            {habit.frequency === 'DAILY' ? 'day' : 'week'}
            {habit.streak !== 1 ? 's' : ''} streak
          </span>
          {habit.streak > 0 && <span className="text-2xl">🔥</span>}
        </div>

        <button
          onClick={handleCheckIn}
          disabled={isCheckingIn || checkedIn}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            checkedIn
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {checkedIn ? '✓ Checked In' : isCheckingIn ? 'Checking...' : 'Check In'}
        </button>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
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
