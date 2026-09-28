import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import ErrorMessage from '../components/ErrorMessage';
import useToast from '../hooks/useToast';
import { createApplication } from '../services/applicationService';
import { getErrorMessage, getFieldErrors } from '../services/api';

export default function AddApplication() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [serverErrors, setServerErrors] = useState({});

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    setServerErrors({});
    try {
      await createApplication(payload);
      showToast('Application added');
      navigate('/applications');
    } catch (err) {
      setError(getErrorMessage(err));
      setServerErrors(getFieldErrors(err));
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Add application</h1>
          <p className="page-sub">Save the details now and update the status as you hear back.</p>
        </div>
      </div>
      <section className="panel">
        <ErrorMessage message={error} />
        <ApplicationForm onSubmit={handleSubmit} submitLabel="Save application" submitting={submitting}
          serverErrors={serverErrors} onCancel={() => navigate('/applications')} />
      </section>
    </>
  );
}
