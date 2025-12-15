import { getActivityFeed } from '@/app/actions/social';
import UserSearch from '@/components/UserSearch';

export default async function SocialFeedPage() {
  const activities = await getActivityFeed();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Feed</h1>
        <p className="text-gray-600 mb-8">Connect with others and see their progress</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Feed</h2>
            
            {activities.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">
                  No activity yet. Follow some users to see their progress here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity: {
                  id: string;
                  date: Date;
                  notes: string | null;
                  habit: {
                    name: string;
                    user: {
                      name: string;
                    };
                  };
                }) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {activity.habit.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">
                          <span className="font-bold">{activity.habit.user.name}</span>{' '}
                          completed{' '}
                          <span className="font-semibold text-blue-600">
                            {activity.habit.name}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleString()}
                        </p>
                        {activity.notes && (
                          <p className="text-sm text-gray-700 mt-2 italic">
                            &quot;{activity.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Find Users</h2>
            <UserSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
