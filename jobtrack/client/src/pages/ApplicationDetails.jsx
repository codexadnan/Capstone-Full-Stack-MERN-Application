import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import useToast from '../hooks/useToast';
import { deleteApplication, fetchApplication } from '../services/applicationService';
import { getErrorMessage } from '../services/api';
import { formatDate, formatSalary } from '../utils/format';

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchApplication(id);
      setApplication(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteApplication(id);
      showToast('Application deleted');
      navigate('/applications');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      setConfirmOpen(false);
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading application..." />;
  if (error) {
    return (
      <>
        <ErrorMessage message={error} onRetry={load} />
        <Button variant="secondary" to="/applications">Back to applications</Button>
      </>
    );
  }

  const details = [
    ['Location', application.location || '-'],
    ['Employment type', application.employmentType],
    ['Salary', application.salary != null ? formatSalary(application.salary) : '-'],
    ['Applied', formatDate(application.appliedDate)],
    ['Interview', formatDate(application.interviewDate)],
    ['Last updated', formatDate(application.updatedAt)],
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{application.position}</h1>
          <p className="page-sub">{application.company} <StatusBadge status={application.status} /></p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" to={`/applications/${id}/edit`}>Edit</Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete</Button>
        </div>
      </div>

      <section className="panel">
        <dl className="details">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div>
            <dt>Job link</dt>
            <dd>
              {application.jobUrl ? (
                <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">Open job posting</a>
              ) : '-'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <h2>Notes</h2>
        <p className="notes">{application.notes || 'No notes added.'}</p>
      </section>

      <Button variant="ghost" to="/applications">Back to applications</Button>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this application?"
        message={`${application.position} at ${application.company} will be permanently removed.`}
        confirmLabel="Delete application"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
