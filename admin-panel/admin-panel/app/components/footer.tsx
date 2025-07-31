import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type {GridRowId} from '@mui/x-data-grid';

type FooterPropsType = {
  selectedId: GridRowId;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isMutationLoading: boolean;
  handleDelete: () => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pages: Set<number>;
  setPages: React.Dispatch<React.SetStateAction<Set<number>>>;
};

export const Footer = ({
  selectedId,
  hasNextPage,
  fetchNextPage,
  isMutationLoading,
  handleDelete,
  page,
  setPage,
  pages,
  setPages,
}: FooterPropsType) => {
  const handlePageChange = async (newPage: number) => {
    setPage(newPage);

    if (hasNextPage && newPage > page) {
      setPages(prev => new Set([...prev, newPage]));
      fetchNextPage();
    }
  };

  return (
    <div className="flex justify-end items-center rounded border border-stone-700 py-1 px-1">
      {selectedId && (
        <>
          <button
            className="bg-blue-700 disabled:bg-blue-950 hover:bg-blue-800 text-white font-medium text-xs px-3 py-1 rounded-md active:ring-1 active:ring-blue-300 transition-all duration-100"
            onClick={() => handleDelete()}
            disabled={isMutationLoading}>
            Delete selected
          </button>
        </>
      )}

      <p className="text-xs text-neutral-100 px-4">Page {page + 1}</p>
      <button
        className=" disabled:text-neutral-500 hover:bg-neutral-600 text-white font-medium text-xs px-2 py-1 rounded-md active:ring-1 active:ring-amber-600 transition-all duration-100"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}>
        <ChevronLeftIcon />
      </button>
      <button
        className="disabled:text-neutral-500 hover:bg-neutral-600 text-white font-medium text-xs px-2 py-1 rounded-md active:ring-1 active:ring-amber-600 transition-all duration-100"
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNextPage && !pages.has(page + 1)}>
        <ChevronRightIcon />
      </button>
    </div>
  );
};
