import {useMemo, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import {DataGrid} from '@mui/x-data-grid';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';
import {useNavigate} from 'react-router';
import CompetitionModal from '~/components/competitionModal';
import {Footer} from '~/components/footer';
import {
  type CompetitionResponse,
  type CreateCompetitionPayload,
  useCreateCompetitionMutation,
  useDeleteCompetitionMutation,
  useGetCompetitionsInfiniteQuery,
  useUpdateCompetitionMutation,
} from '~/redux/api/endpoints/competitions';

import type {Route} from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    {title: 'Admin Dashboard'},
    {name: 'description', content: 'Welcome to clout enterprises. '},
  ];
}

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID'}, //, width: 250 },
  {field: 'category', headerName: 'Category', editable: true},
  {field: 'description', headerName: 'Description', editable: true},
  {field: 'status', headerName: 'Status', editable: true},
  {
    field: 'created_at',
    headerName: 'Created At',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
  },
  {
    field: 'start_time',
    headerName: 'Start Time',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
    editable: true,
  },
  {
    field: 'vote_start_time',
    headerName: 'Vote Start Time',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
    editable: true,
  },
  {
    field: 'end_time',
    headerName: 'End Time',
    //width: 180,
    valueFormatter: params => new Date(params).toLocaleString(),
    editable: true,
  },
  {
    field: 'competition_number',
    headerName: 'Competition #',
    //width: 150,
    type: 'number',
  },
];

export default function Competition() {
  const [pages, setPages] = useState(new Set([0]));
  const [page, setPage] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<GridRowId>('');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [createCompetition] = useCreateCompetitionMutation();
  const [updateCompetition] = useUpdateCompetitionMutation();
  const [deleteCompetition, {isLoading: isMutationLoading}] =
    useDeleteCompetitionMutation();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCompetitionsInfiniteQuery();

  const competitions = useMemo(
    () => data?.pages[page]?.data || [],
    [data, page],
  );

  const handleEntriesClick = () => {
    navigate(`/competitions/${selectedId}/entries`);
  };

  const handleVotesClick = () => {
    navigate(`/competitions/${selectedId}/votes`);
  };

  const handleCreateCompetition = async (data: CreateCompetitionPayload) => {
    try {
      await createCompetition(data).unwrap();
      setAlert({type: 'success', message: 'Competition created!'});
      refetch(); // Refresh list
    } catch (err: any) {
      const message = err?.data?.detail || 'Error creating competition';
      setAlert({type: 'error', message});
    }
  };

  const handleUpdate = async (
    newRow: CompetitionResponse,
    oldRow: CompetitionResponse,
  ) => {
    const changedFields: Partial<CompetitionResponse> = {};

    //checking which cell is updated.
    Object.keys(newRow).forEach(key => {
      const typedKey = key as keyof CompetitionResponse;
      const newValue = newRow[typedKey];
      const oldValue = oldRow[typedKey];

      if (newValue !== oldValue) {
        (changedFields as any)[typedKey] = newValue;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      return oldRow;
    }

    const updated = await updateCompetition({
      competition_id: oldRow.id,
      body: changedFields,
    });

    if ('error' in updated) {
      setAlert({
        type: 'error',
        message: `Update failed`,
      });
      return oldRow;
    }

    setAlert({type: 'success', message: 'Edit successful.'});
    return newRow;
  };

  const handleCompetitionDelete = () => {
    deleteCompetition(selectedId.toString());
  };

  return (
    <main className="flex-1 flex flex-col bg-neutral-900 p-4 overflow-hidden">
      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{mb: 2}}>
          {alert.message}
        </Alert>
      )}
      {/* Large table on top */}
      <div className="flex gap-4 pb-2 justify-between">
        <h2 className=" font-semibold bg-stone-900">Competitions</h2>
        {selectedId && (
          <>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
              onClick={() => handleEntriesClick()}>
              Show selected entries
            </button>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
              onClick={() => handleVotesClick()}>
              Show selected votes
            </button>
          </>
        )}
        <button
          className="disabled:text-neutral-500 hover:bg-neutral-600 text-white font-medium text-xs px-2 py-1 rounded-md active:ring-1 active:ring-amber-600 transition-all duration-100 items-center flex gap-1"
          onClick={() => setShowAddForm(prev => !prev)}>
          {showAddForm ? 'Cancel' : 'Add new'}
          <AddIcon fontSize="small" />
        </button>
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
          onClick={refetch}
          disabled={isLoading}>
          Refresh
        </button>
      </div>
      <div className="flex-1 mb-1 overflow-auto rounded border border-stone-700">
        <DataGrid
          rows={competitions}
          columns={columns}
          checkboxSelection={false}
          onRowSelectionModelChange={newSelection => {
            const id = Array.from(newSelection.ids)[0];
            setSelectedId(id);
          }}
          pageSizeOptions={[5, 10]}
          disableColumnMenu
          disableColumnSorting
          sx={{
            border: 0,
          }}
          processRowUpdate={handleUpdate}
          hideFooter
        />
      </div>
      <Footer
        selectedId={selectedId}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isMutationLoading={isLoading}
        handleDelete={handleCompetitionDelete}
        page={page}
        setPage={setPage}
        pages={pages}
        setPages={setPages}
      />
      <CompetitionModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        onSubmit={handleCreateCompetition}
      />
    </main>
  );
}
