import { useCallback, useEffect, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationCard from '../components/ApplicationCard';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import useDebounce from '../hooks/useDebounce';
import useToast from '../hooks/useToast';
import { deleteApplication, fetchApplications } from '../services/applicationService';
import { getErrorMessage } from '../services/api';
import { EMPLOYMENT_TYPES, SORT_OPTIONS, STATUSES } from '../utils/constants';

const defaultFilters = { search: '', status: '', employmentType: '', sort: 'newest' };

export default function Applications() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.search);
  const hasFilters = Boolean(filters.search || filters.status || filters.employmentType);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchApplications({
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        employmentType: filters.employmentType || undefined,
        sort: filters.sort,
        page,
        limit: 10,
      });
      setApplications(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.status, filters.employmentType, filters.sort, page]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1); // go back to the first page whenever filters change
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteApplication(toDelete._id);
      showToast('Application deleted');
      setToDelete(null);
      // If we deleted the last item on this page, step back one page
      if (applications.length === 1 && page > 1) setPage(page - 1);
      else loadApplications();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Applications</h1>
          <p className="page-sub">Search, filter and update everything you have applied to.</p>
        </div>
        <Button to="/applications/new">Add application</Button>
      </div>

      <section className="filters" aria-label="Search and filters">
        <Input label="Search" name="search" type="search" value={filters.search}
          onChange={updateFilter} placeholder="Company or position" className="filter-search" />
        <Select label="Status" name="status" value={filters.status} onChange={updateFilter}
          options={STATUSES} placeholder="All statuses" />
        <Select label="Employment type" name="employmentType" value={filters.employmentType}
          onChange={updateFilter} options={EMPLOYMENT_TYPES} placeholder="All types" />
        <Select label="Sort by" name="sort" value={filters.sort} onChange={updateFilter} options={SORT_OPTIONS} />
      </section>

      <ErrorMessage message={error} onRetry={loadApplications} />

      {loading && applications.length === 0 && !error && <Skeleton rows={6} />}

      {!error && !(loading && applications.length === 0) && (
        applications.length === 0 ? (
          hasFilters ? (
            <EmptyState
              title="No matching applications"
              message="Nothing matches your search or filters. Try different keywords or clear the filters."
              action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <EmptyState
              title="No applications yet"
              message="Track your first job application to start building your pipeline."
              action={<Button to="/applications/new">Add application</Button>}
            />
          )
        ) : (
          <div className={loading ? 'is-refreshing' : ''}>
            <div className="only-desktop">
              <ApplicationTable applications={applications} onDelete={setToDelete} />
            </div>
            <div className="only-mobile">
              {applications.map((app) => (
                <ApplicationCard key={app._id} application={app} onDelete={setToDelete} />
              ))}
            </div>
            <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />
          </div>
        )
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this application?"
        message={toDelete ? `${toDelete.position} at ${toDelete.company} will be permanently removed.` : ''}
        confirmLabel="Delete application"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
