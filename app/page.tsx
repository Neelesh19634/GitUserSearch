import Link from 'next/link';

const getAllUsers = async () => {
  const res = await fetch(`https://api.github.com/users`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const submitSearch = async (query: string) => {
  const res = await fetch(`https://api.github.com/search/users?q=${query}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch search results');
  const data = await res.json();
  return data.items;
};

interface Props {
  searchParams?: Promise<{ q?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const query = params?.q || '';

  const users = query ? await submitSearch(query) : await getAllUsers();

  return (
    <>
      <div>
        <form
          method="GET"
          className="flex justify-center items-center p-4 bg-blue-500 text-white"
        >
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search GitHub Users..."
            className="p-2 rounded-l-lg w-64 text-black"
            style={{ outline: 'none', border: 'none' }}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 hover:cursor-pointer text-white font-bold py-2 px-4 rounded-r-lg"
            style={{ outline: 'none', border: 'none' }}
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex justify-center items-center py-5 bg-gray-100 dark:bg-gray-900 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GitHub Users</h1>
      </div>

      {/* ✅ Outer wrapper with min-h-screen to fix layout */}
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4 pb-8">
          {users.map((user: any) => (
            <Link
              key={user.id}
              href={`/user/${user.login}`}
              className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-6 flex flex-col items-center cursor-pointer 
                         hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-24 h-24 rounded-full mb-4 border-2 border-blue-500"
              />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.login}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.type}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
