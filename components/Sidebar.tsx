'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'My Habits', icon: '✓' },
    { href: '/dashboard/social', label: 'Social Feed', icon: '👥' },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors flex items-center gap-3"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
