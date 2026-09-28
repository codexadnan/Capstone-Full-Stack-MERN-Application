import Button from './Button';

export default function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return <p className="pagination-info">{total} {total === 1 ? 'application' : 'applications'}</p>;
  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination-info">Page {page} of {pages} ({total} applications)</p>
      <div>
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
        <Button variant="secondary" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </nav>
  );
}
