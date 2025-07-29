import { useMemo } from "react";
import {
  useGetCompetitionEntriesInfiniteQuery,
  useGetCompetitionsInfiniteQuery,
} from "~/redux/api/endpoints/competitions";

export function Dashboard() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCompetitionsInfiniteQuery();

  const feedPosts = useMemo(
    () => data?.pages?.flatMap((page) => page.data) || [],
    [data]
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-800 text-white p-4 space-y-4 border-r border-stone-400">
        <h2 className="text-2xl font-semibold">Clout Admin</h2>
        <nav className="flex flex-col space-y-2">
          <a href="/dashboard" className="hover:bg-stone-700 p-2 rounded">
            Dashboard
          </a>
          <a href="/profile" className="hover:bg-stone-700 p-2 rounded">
            Profile
          </a>
          <a href="/settings" className="hover:bg-stone-700 p-2 rounded">
            Settings
          </a>
        </nav>
      </aside>

      <main className="flex-1 bg-stone-900 p-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </main>
    </div>
  );
}
