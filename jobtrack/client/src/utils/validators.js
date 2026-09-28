// Client-side validation. The server validates again: never trust only the browser.
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Enter your email address';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Enter your password';
  return errors;
};

export const validateRegister = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter your name';
  else if (name.trim().length < 2 || name.trim().length > 50) errors.name = 'Name must be 2-50 characters';

  if (!email.trim()) errors.email = 'Enter your email address';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Create a password';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = 'Password must contain a letter and a number';
  }

  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateApplication = (values) => {
  const errors = {};
  if (!values.company.trim()) errors.company = 'Enter the company name';
  else if (values.company.trim().length > 100) errors.company = 'Company must be 100 characters or fewer';

  if (!values.position.trim()) errors.position = 'Enter the position';
  else if (values.position.trim().length > 100) errors.position = 'Position must be 100 characters or fewer';

  if (values.location.length > 100) errors.location = 'Location must be 100 characters or fewer';

  if (values.jobUrl.trim()) {
    try {
      const url = new URL(values.jobUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      errors.jobUrl = 'Enter a full link, for example https://company.com/jobs/123';
    }
  }

  if (values.salary !== '' && (Number.isNaN(Number(values.salary)) || Number(values.salary) < 0)) {
    errors.salary = 'Salary must be a positive number';
  }

  if (values.appliedDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (new Date(values.appliedDate) > tomorrow) errors.appliedDate = 'Applied date cannot be in the future';
  }

  if (values.interviewDate && values.appliedDate && values.interviewDate < values.appliedDate) {
    errors.interviewDate = 'Interview date cannot be before the applied date';
  }

  if (values.notes.length > 2000) errors.notes = 'Notes must be 2000 characters or fewer';
  return errors;
};
