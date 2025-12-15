'use client';

import { useState } from 'react';
import HabitCard from './HabitCard';

type HabitWithCompletions = any;

export default function HabitList({ habits }: { habits: HabitWithCompletions[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(habits.map((h) => h.category))];

  const filteredHabits =
    selectedCategory === 'all'
      ? habits
      : habits.filter((h) => h.category === selectedCategory);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
          Filter by category:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            {selectedCategory === 'all'
              ? 'No habits yet. Create your first habit to get started!'
              : `No habits in "${selectedCategory}" category.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
