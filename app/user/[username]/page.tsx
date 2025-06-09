import Link from 'next/link';
import React from 'react';

interface Props {
  params: {
    username: string[];
  };
}

const getUserData = async (username: string) => {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

export default async function Page({ params }: Props) {
  const username = params.username[0]; // Use first part from catch-all route
  const user = await getUserData(username);

  if (!user) {
    return <div className="text-center text-red-500 mt-10">User not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center transform transition duration-500 hover:scale-[1.02]">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-lg"
        />
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
          {user.name || user.login}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.login}</p>
        <p className="text-gray-600 dark:text-gray-300 mt-3 italic">{user.bio || 'No bio available.'}</p>

        <div className="mt-4 flex justify-around text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-semibold">{user.followers}</p>
            <p>Followers</p>
          </div>
          <div>
            <p className="font-semibold">{user.following}</p>
            <p>Following</p>
          </div>
          <div>
            <p className="font-semibold">{user.public_repos}</p>
            <p>Repos</p>
          </div>
        </div>

        <Link
          href={user.html_url}
          target="_blank"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          View GitHub Profile
        </Link>
      </div>
    </div>
  );
}
