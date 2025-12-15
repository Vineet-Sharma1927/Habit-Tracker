import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Habit Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Build better habits, track your progress, and achieve your goals with our powerful habit tracking platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

