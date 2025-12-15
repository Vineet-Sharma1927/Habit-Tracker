'use client';

import { useState } from 'react';
import { followUser, unfollowUser } from '@/app/actions/social';

export default function FollowButton({
  userId,
  initialIsFollowing,
}: {
  userId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleFollow = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = isFollowing
        ? await unfollowUser(userId)
        : await followUser(userId);

      if (result.success) {
        setIsFollowing(!isFollowing);
      } else {
        setError(result.error || 'Action failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggleFollow}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
