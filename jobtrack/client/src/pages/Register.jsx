import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { validateRegister } from '../utils/validators';
import { getErrorMessage, getFieldErrors } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    const found = validateRegister(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name: values.name.trim(), email: values.email.trim(), password: values.password });
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
        <h1>Create your account</h1>
        <p className="auth-sub">Start tracking your applications in under a minute.</p>

        <ErrorMessage message={apiError} />

        <form onSubmit={handleSubmit} noValidate>
          <Input label="Name" name="name" autoComplete="name" value={values.name}
            onChange={handleChange} error={errors.name} />
          <Input label="Email" name="email" type="email" autoComplete="email" value={values.email}
            onChange={handleChange} error={errors.email} />
          <Input label="Password" name="password" type="password" autoComplete="new-password"
            value={values.password} onChange={handleChange} error={errors.password}
            hint="At least 8 characters, with a letter and a number" />
          <Input label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password"
            value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          <Button type="submit" loading={submitting} className="btn-block">Create account</Button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
