import {useMemo, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import {DataGrid, type GridColDef, type GridRowId} from '@mui/x-data-grid';
import {skipToken} from '@reduxjs/toolkit/query';
import EntryModal, {type CreatePostPayload} from '~/components/entryModal';
import {Footer} from '~/components/footer';
import {
  type CreateVotePayload,
  useCreatePostMutation,
  useCreateVoteMutation,
  useDeleteEntryMutation,
  useGetCompetitionEntriesInfiniteQuery,
  useGetCurrentCompetitionQuery,
  useGetVotePairQuery,
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

export default function Simulation() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [pages, setPages] = useState(new Set([0]));
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<GridRowId>('');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {data: competitionData, isLoading} = useGetCurrentCompetitionQuery();
  const {
    data: votePair,
    isLoading: isLoadingPairs,
    refetch: refetchVotePairs,
  } = useGetVotePairQuery();

  const [createVote] = useCreateVoteMutation();

  console.log(votePair?.entry_1, votePair?.entry_2);

  const [createEntry] = useCreatePostMutation();

  const votingCompetition = competitionData?.data.find(
    comp => comp.status === 'voting',
  );

  const {
    data: entriesData,
    isLoading: entriesIsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCompetitionEntriesInfiniteQuery(
    votingCompetition?.id ? votingCompetition.id : skipToken,
  );

  const [deleteEntry, {isLoading: isMutationLoading}] =
    useDeleteEntryMutation();

  const entryList = useMemo(
    () => entriesData?.pages[page]?.data || [],
    [entriesData, page],
  );

  const handleEntryDeleteClick = () => {
    deleteEntry(selectedId.toString());
  };

  const handleVoteClick = async (data: CreateVotePayload) => {
    //refetchVotePairs();
    /* cast vote here */
    try {
      const message = await createVote(data).unwrap();
      setAlert({type: 'success', message: message.message});
    } catch (err: any) {
      const message = err?.data?.detail || 'Error casting vote';
      setAlert({type: 'error', message});
    }
  };

  const handleCreateEntry = async (data: CreatePostPayload) => {
    try {
      await createEntry(data).unwrap();
      setAlert({type: 'success', message: 'Competition created!'});
      //refetch(); // ADD THIS
    } catch (err: any) {
      const message = err?.data?.detail || 'Error creating competition';
      setAlert({type: 'error', message});
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-neutral-900 p-4 overflow-hidden h-screen">
      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{mb: 2}}>
          {alert.message}
        </Alert>
      )}
      <div className="flex gap-4 pb-2 justify-between">
        <h2 className=" font-semibold bg-stone-900">
          Competition with category {votingCompetition?.category} and id{' '}
          {votingCompetition?.id}
        </h2>
        <button
          className="disabled:text-neutral-500 hover:bg-neutral-600 text-white font-medium text-xs px-2 py-1 rounded-md active:ring-1 active:ring-amber-600 transition-all duration-100 items-center flex gap-1"
          onClick={() => setShowAddForm(prev => !prev)}>
          {showAddForm ? 'Cancel' : 'Add new'}
          <AddIcon fontSize="small" />
        </button>
      </div>
      <div className="flex justify-evenly mt-4">
        {/* Left Image */}
        <div className="flex flex-col items-center bg-stone-800 p-2 rounded-md">
          {!isLoadingPairs && (
            <img
              src={votePair?.entry_1.post.image_url}
              alt="Image 1"
              className="w-75 h-100 object-cover rounded-md"
            />
          )}
          <button
            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded text-sm"
            onClick={() =>
              votePair
                ? handleVoteClick({
                    winner_id: votePair?.entry_1.id,
                    loser_id: votePair?.entry_2.id,
                  })
                : () => console.log('Undefined votePair')
            }>
            Vote
          </button>
        </div>

        {/* Right Image */}
        <div className="flex flex-col items-center bg-stone-800 p-2 rounded-md">
          {!isLoadingPairs && (
            <img
              src={votePair?.entry_2.post.image_url}
              alt="Image 1"
              className="w-75 h-100 object-cover rounded-md"
            />
          )}
          <button
            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded text-sm"
            onClick={() =>
              votePair
                ? handleVoteClick({
                    winner_id: votePair?.entry_2.id,
                    loser_id: votePair?.entry_1.id,
                  })
                : () => console.log('Undefined votePair')
            }>
            Vote
          </button>
        </div>
      </div>
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
      <EntryModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        onSubmit={handleCreateEntry}
      />
    </main>
  );
}
