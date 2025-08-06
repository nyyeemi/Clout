import {useMemo, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import {DataGrid} from '@mui/x-data-grid';
import type {GridColDef, GridRowId} from '@mui/x-data-grid';
import {Footer} from '~/components/footer';
import {useDeleteCompetitionMutation} from '~/redux/api/endpoints/competitions';
import {useGetUsersInfiniteQuery} from '~/redux/api/endpoints/users';

import type {Route} from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    {title: 'Admin Dashboard'},
    {name: 'description', content: 'Welcome to clout enterprises. '},
  ];
}

const columns: GridColDef[] = [
  {field: 'id', headerName: 'ID', flex: 1},
  {field: 'username', headerName: 'Username', flex: 1},
  {field: 'email', headerName: 'Email', flex: 1.5},
  {field: 'first_name', headerName: 'First Name', flex: 1},
  {field: 'last_name', headerName: 'Last Name', flex: 1},
  {field: 'bio', headerName: 'Bio', flex: 2},
  {field: 'profile_picture_url', headerName: 'Profile Picture', flex: 2},
  {
    field: 'is_active',
    headerName: 'Active',
    type: 'boolean',
    flex: 0.7,
  },
  {
    field: 'is_superuser',
    headerName: 'Admin',
    type: 'boolean',
    flex: 0.7,
  },
  {
    field: 'num_followers',
    headerName: 'Followers',
    type: 'number',
    flex: 0.7,
  },
  {
    field: 'num_following',
    headerName: 'Following',
    type: 'number',
    flex: 0.7,
  },
  {
    field: 'num_posts',
    headerName: 'Posts',
    type: 'number',
    flex: 0.7,
  },
];

export default function Users() {
  const [pages, setPages] = useState(new Set([0]));
  const [page, setPage] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedId, setSelectedId] = useState<GridRowId>('');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  /*const [deleteCompetition, {isLoading: isMutationLoading}] =
    useDeleteCompetitionMutation();*/

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetUsersInfiniteQuery();

  const users = useMemo(() => data?.pages[page]?.data || [], [data, page]);

  const handleUserDelete = () => {
    //deleteCompetition(selectedId.toString());
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
        <h2 className=" font-semibold bg-stone-900">Users</h2>

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
          rows={users}
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
          //processRowUpdate={handleUpdate}
          hideFooter
        />
      </div>
      <Footer
        selectedId={selectedId}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isMutationLoading={isLoading}
        handleDelete={handleUserDelete}
        page={page}
        setPage={setPage}
        pages={pages}
        setPages={setPages}
      />
    </main>
  );
}
