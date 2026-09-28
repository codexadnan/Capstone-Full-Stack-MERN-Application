import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { validateLogin } from '../utils/validators';
import { getErrorMessage, getFieldErrors } from '../services/api';

export default function Login() {
  const { login, sessionExpired } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      // PublicRoute redirects to the dashboard once the user is set
    } catch (error) {
      setApiError(getErrorMessage(error));
      setErrors(getFieldErrors(error));
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Logo />
        <h1>Log in</h1>
        <p className="auth-sub">Welcome back. Pick up where you left off.</p>

        {sessionExpired && (
          <div className="notice" role="status">Your session expired. Log in again to continue.</div>
        )}
        <ErrorMessage message={apiError} />

        <form onSubmit={handleSubmit} noValidate>
          <Input label="Email" name="email" type="email" autoComplete="email"
            value={values.email} onChange={handleChange} error={errors.email} />
          <Input label="Password" name="password" type="password" autoComplete="current-password"
            value={values.password} onChange={handleChange} error={errors.password} />
          <Button type="submit" loading={submitting} className="btn-block">Log in</Button>
        </form>

        <p className="auth-switch">New to JobTrack? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
