import {useMemo, useState} from 'react';

import {DataGrid} from '@mui/x-data-grid';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';
import {useNavigate} from 'react-router';
import {
  type CompetitionResponse,
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
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<GridRowId>();
  const [updateCompetition] = useUpdateCompetitionMutation();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCompetitionsInfiniteQuery();

  const competitions = useMemo(
    () => data?.pages?.flatMap(page => page.data) || [],
    [data],
  );

  const handleEntriesClick = () => {
    navigate(`/competitions/${selectedId}/entries`);
  };

  const handleVotesClick = () => {
    navigate(`/competitions/${selectedId}/votes`);
  };

  const handleUpdate = (
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

    updateCompetition({competition_id: oldRow.id, body: changedFields});

    return newRow;
  };

  return (
    <main className="flex-1 flex flex-col bg-neutral-900 p-4 overflow-hidden">
      {/* Large table on top */}
      <div className="flex gap-4 pb-2 justify-between">
        <h2 className=" font-semibold bg-stone-900">Competitions</h2>
        {selectedId && (
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
            onClick={() => handleEntriesClick()}>
            Show selected entries
          </button>
        )}
        {selectedId && (
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
            onClick={() => handleVotesClick()}>
            Show selected votes
          </button>
        )}
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
        />
      </div>
    </main>
  );
}
