import { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { EMPLOYMENT_TYPES, STATUSES } from '../utils/constants';
import { toDateInput, todayInput } from '../utils/format';
import { validateApplication } from '../utils/validators';

export const emptyApplication = {
  company: '', position: '', location: '', employmentType: 'Full-time', jobUrl: '',
  salary: '', status: 'Applied', appliedDate: todayInput(), interviewDate: '', notes: '',
};

// Converts an API application into form values (all strings)
export const applicationToForm = (application) => ({
  company: application.company ?? '',
  position: application.position ?? '',
  location: application.location ?? '',
  employmentType: application.employmentType ?? 'Full-time',
  jobUrl: application.jobUrl ?? '',
  salary: application.salary ?? '',
  status: application.status ?? 'Applied',
  appliedDate: toDateInput(application.appliedDate),
  interviewDate: toDateInput(application.interviewDate),
  notes: application.notes ?? '',
});

export default function ApplicationForm({
  initialValues = emptyApplication, onSubmit, submitLabel, submitting, serverErrors = {}, onCancel,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateApplication(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      ...values,
      company: values.company.trim(),
      position: values.position.trim(),
      salary: values.salary === '' ? '' : Number(values.salary),
    });
  };

  const fieldError = (name) => errors[name] || serverErrors[name];

  return (
    <form onSubmit={handleSubmit} noValidate className="form-grid">
      <Input label="Company" name="company" value={values.company} onChange={handleChange}
        error={fieldError('company')} maxLength={100} placeholder="Acme Inc." />
      <Input label="Position" name="position" value={values.position} onChange={handleChange}
        error={fieldError('position')} maxLength={100} placeholder="Frontend developer" />
      <Input label="Location" name="location" value={values.location} onChange={handleChange}
        error={fieldError('location')} placeholder="City, country or Remote" />
      <Select label="Employment type" name="employmentType" value={values.employmentType}
        onChange={handleChange} options={EMPLOYMENT_TYPES} error={fieldError('employmentType')} />
      <Select label="Status" name="status" value={values.status} onChange={handleChange}
        options={STATUSES} error={fieldError('status')} />
      <Input label="Salary (yearly, optional)" name="salary" type="number" min="0" inputMode="numeric"
        value={values.salary} onChange={handleChange} error={fieldError('salary')} placeholder="60000" />
      <Input label="Applied date" name="appliedDate" type="date" value={values.appliedDate}
        onChange={handleChange} error={fieldError('appliedDate')} />
      <Input label="Interview date (optional)" name="interviewDate" type="date" value={values.interviewDate}
        onChange={handleChange} error={fieldError('interviewDate')} />
      <Input label="Job link (optional)" name="jobUrl" type="url" value={values.jobUrl}
        onChange={handleChange} error={fieldError('jobUrl')} placeholder="https://company.com/jobs/123"
        className="span-2" />
      <Input label="Notes (optional)" name="notes" as="textarea" rows={5} value={values.notes}
        onChange={handleChange} error={fieldError('notes')} maxLength={2000}
        hint={`${values.notes.length}/2000`} className="span-2" />

      <div className="form-actions span-2">
        {onCancel && <Button variant="secondary" onClick={onCancel} disabled={submitting}>Cancel</Button>}
        <Button type="submit" loading={submitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
