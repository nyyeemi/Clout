import { useMemo } from "react";
import {
  useGetCompetitionEntriesInfiniteQuery,
  useGetCompetitionsInfiniteQuery,
} from "~/redux/api/endpoints/competitions";

import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  { field: "category", headerName: "Category", width: 130 },
  { field: "description", headerName: "Description", width: 200 },
  { field: "status", headerName: "Status", width: 120 },
  {
    field: "created_at",
    headerName: "Created At",
    width: 180,
    valueFormatter: (params) => new Date(params).toLocaleString(),
  },
  {
    field: "start_time",
    headerName: "Start Time",
    width: 180,
    valueFormatter: (params) => new Date(params).toLocaleString(),
  },
  {
    field: "vote_start_time",
    headerName: "Vote Start Time",
    width: 180,
    valueFormatter: (params) => new Date(params).toLocaleString(),
  },
  {
    field: "end_time",
    headerName: "End Time",
    width: 180,
    valueFormatter: (params) => new Date(params).toLocaleString(),
  },
  {
    field: "competition_number",
    headerName: "Competition #",
    width: 150,
    type: "number",
  },
];

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
    <div className="flex flex-col h-screen">
      <header className="flex bg-stone-950 justify-between p-4 shadow-md border-b-orange-500 border-b">
        <h2 className="text-2xl font-semibold">Clout Admin</h2>
      </header>
      {/* Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-stone-800 text-white p-4 space-y-4 border-r border-stone-400">
          <h2 className="text-2xl font-semibold">Dash</h2>
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

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-stone-900 p-6 overflow-hidden">
          <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>

          {/* Table Container that scrolls internally */}
          <div className="flex-1 overflow-auto rounded border border-stone-700">
            <DataGrid
              rows={feedPosts}
              columns={columns}
              checkboxSelection
              pageSizeOptions={[5, 10]}
              sx={{
                border: 0,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
