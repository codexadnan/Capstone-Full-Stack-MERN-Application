import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationForm, { applicationToForm } from '../components/ApplicationForm';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import useToast from '../hooks/useToast';
import { fetchApplication, updateApplication } from '../services/applicationService';
import { getErrorMessage, getFieldErrors } from '../services/api';

export default function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [serverErrors, setServerErrors] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await fetchApplication(id);
      setApplication(data.data);
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    setServerErrors({});
    try {
      await updateApplication(id, payload);
      showToast('Application updated');
      navigate(`/applications/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setServerErrors(getFieldErrors(err));
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading application..." />;
  if (loadError) {
    return (
      <>
        <ErrorMessage message={loadError} onRetry={load} />
        <Button variant="secondary" to="/applications">Back to applications</Button>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Edit application</h1>
          <p className="page-sub">{application.position} at {application.company}</p>
        </div>
      </div>
      <section className="panel">
        <ErrorMessage message={error} />
        <ApplicationForm initialValues={applicationToForm(application)} onSubmit={handleSubmit}
          submitLabel="Save changes" submitting={submitting} serverErrors={serverErrors}
          onCancel={() => navigate(`/applications/${id}`)} />
      </section>
    </>
  );
}
