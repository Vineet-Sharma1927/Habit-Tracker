import { auth } from '@/auth';
import { getUserHabits } from '@/app/actions/habits';
import CreateHabitForm from '@/components/CreateHabitForm';
import HabitList from '@/components/HabitList';

export default async function DashboardPage() {
  const session = await auth();
  const habits = await getUserHabits();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Habits</h1>
            <p className="text-gray-600">
              Welcome back, {session?.user?.name}!
            </p>
          </div>
          <CreateHabitForm />
        </div>
        
        <HabitList habits={habits} />
      </div>
    </div>
  );
}
