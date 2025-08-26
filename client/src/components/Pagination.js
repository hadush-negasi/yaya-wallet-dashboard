export default function Pagination({ currentPage, lastPage, onPageChange }) {
  return (
    <div className="flex items-center justify-between mt-3">
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      <div>
        Page {currentPage} of {lastPage}
      </div>
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
      >
        Next
      </button>
    </div>
  );
}