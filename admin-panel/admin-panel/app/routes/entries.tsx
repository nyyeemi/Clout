import {useMemo, useState} from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {DataGrid, type GridColDef, type GridRowId} from '@mui/x-data-grid';
import {skipToken} from '@reduxjs/toolkit/query';
import {useNavigate, useParams} from 'react-router';
import {Footer} from '~/components/footer';
import {
  useDeleteEntryMutation,
  useGetCompetitionEntriesInfiniteQuery,
} from '~/redux/api/endpoints/competitions';

import type {Route} from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    {title: 'Admin Dashboard | Competition Entries'},
    {name: 'description', content: 'Welcome to clout enterprises. '},
  ];
}

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID', flex: 1},
  {field: 'competition_id', headerName: 'Competition ID', flex: 1},
  {field: 'post_id', headerName: 'Post ID', flex: 1},
  {field: 'owner_id', headerName: 'Owner ID', flex: 1},
  {field: 'mu', headerName: 'Mu', type: 'number', flex: 0.5},
  {field: 'sigma', headerName: 'Sigma', type: 'number', flex: 0.5},
  {field: 'upvotes', headerName: 'Upvotes', type: 'number', flex: 0.5},
  {field: 'downvotes', headerName: 'Downvotes', type: 'number', flex: 0.5},
  {
    field: 'comparisons',
    headerName: 'Comparisons',
    type: 'number',
    flex: 0.5,
  },
];

export default function Entries() {
  const {id} = useParams();
  const [pages, setPages] = useState(new Set([0]));
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<GridRowId>('');

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCompetitionEntriesInfiniteQuery(id ? id : skipToken);

  const [deleteEntry, {isLoading: isMutationLoading}] =
    useDeleteEntryMutation();

  const entryList = useMemo(() => data?.pages[page]?.data || [], [data, page]);

  const handleEntryDeleteClick = () => {
    deleteEntry(selectedId.toString());
  };

  return (
    <main className="flex-1 flex flex-col bg-neutral-900 p-4 overflow-hidden h-screen">
      <header className="flex gap-4 pb-2 justify-between">
        <button
          className="disabled:text-neutral-500 hover:bg-neutral-600 text-white font-medium text-xs px-2 py-1 rounded-md active:ring-1 active:ring-amber-600 transition-all duration-100"
          onClick={() => navigate(-1)}>
          <ChevronLeftIcon />
        </button>
        <h2 className=" font-semibold bg-stone-900">Competition Entries</h2>

        <button
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
          onClick={refetch}
          disabled={isLoading}>
          Refresh
        </button>
      </header>
      <div className="flex-1 overflow-hidden rounded border border-stone-700">
        <DataGrid
          rows={entryList}
          columns={columns}
          checkboxSelection={false}
          onRowSelectionModelChange={newSelection => {
            const id = Array.from(newSelection.ids)[0];
            setSelectedId(id);
          }}
          disableColumnMenu
          disableColumnSorting
          hideFooter
          sx={{
            border: 0,
          }}
        />
      </div>
      <Footer
        selectedId={selectedId}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isMutationLoading={isMutationLoading}
        handleDelete={handleEntryDeleteClick}
        page={page}
        setPage={setPage}
        pages={pages}
        setPages={setPages}
      />
    </main>
  );
}
