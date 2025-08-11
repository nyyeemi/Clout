import {useMemo, useState} from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {DataGrid} from '@mui/x-data-grid';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';
import {skipToken} from '@reduxjs/toolkit/query';
import {useNavigate, useParams} from 'react-router';
import {Footer} from '~/components/footer';
import {
  useDeleteVoteMutation,
  useGetCompetitionVotesInfiniteQuery,
} from '~/redux/api/endpoints/competitions';

import type {Route} from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    {title: 'Admin Dashboard | Vote pairs'},
    {name: 'description', content: 'Welcome to clout enterprises. '},
  ];
}

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID'},
  {field: 'user_id', headerName: 'Voter id'},
  {field: 'entry_id_1', headerName: 'Entry 1'},
  {field: 'entry_id_2', headerName: 'Entry 2'},
  {field: 'winner_entry_id', headerName: 'Winner entry id'},
  {
    field: 'created_at',
    headerName: 'Created at',
    valueFormatter: params => new Date(params).toLocaleString(),
  },
];

export default function Votes() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [pages, setPages] = useState(new Set([0]));
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<GridRowId>('');

  const [deleteVote, {isLoading: isMutationLoading}] = useDeleteVoteMutation();

  const handleVoteDeleteClick = () => {
    deleteVote(selectedId.toString());
  };

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCompetitionVotesInfiniteQuery(id ? id : skipToken);

  const voteList = useMemo(() => data?.pages[page]?.data || [], [data, page]);

  return (
    <main className="flex-1 flex flex-col bg-neutral-900 p-4 overflow-hidden h-screen">
      {/* Large table on top */}
      <div className="flex gap-4 pb-2 justify-between">
        <button
          className="disabled:text-neutral-500 hover:bg-neutral-600 text-white font-medium text-xs px-2 py-1 rounded-md active:ring-1 active:ring-amber-600 transition-all duration-100"
          onClick={() => navigate(-1)}>
          <ChevronLeftIcon />
        </button>
        <h2 className=" font-semibold bg-stone-900">Vote pairs</h2>

        <button
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
          onClick={refetch}
          disabled={isLoading}>
          Refresh
        </button>
      </div>
      <div className="flex-1 mb-1 overflow-auto rounded border border-stone-700">
        <DataGrid
          rows={voteList}
          columns={columns}
          checkboxSelection={false}
          onRowSelectionModelChange={newSelection => {
            const id = Array.from(newSelection.ids)[0];
            setSelectedId(id);
          }}
          hideFooter
          disableColumnMenu
          disableColumnSorting
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
        handleDelete={handleVoteDeleteClick}
        page={page}
        setPage={setPage}
        pages={pages}
        setPages={setPages}
      />
    </main>
  );
}
