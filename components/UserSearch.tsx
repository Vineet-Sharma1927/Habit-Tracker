'use client';

import { useState, useEffect } from 'react';
import { searchUsers, getFollowingStatus } from '@/app/actions/social';
import FollowButton from '@/components/FollowButton';

type UserSearchResult = {
  id: string;
  name: string;
  email: string;
  _count: {
    habits: number;
    followers: number;
  };
};

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const users = await searchUsers(query);
        setResults(users as UserSearchResult[]);

        const followingStatuses: Record<string, boolean> = {};
        await Promise.all(
          users.map(async (user: { id: string }) => {
            followingStatuses[user.id] = await getFollowingStatus(user.id);
          })
        );
        setFollowingMap(followingStatuses);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">Searching...</div>
      )}

      {!isLoading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">No users found</div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>{user._count.habits} habits</span>
                  <span>{user._count.followers} followers</span>
                </div>
              </div>
              <FollowButton
                userId={user.id}
                initialIsFollowing={followingMap[user.id] || false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
