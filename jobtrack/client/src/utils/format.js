export const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

// ISO date -> value for <input type="date"> (YYYY-MM-DD)
export const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export const todayInput = () => new Date().toISOString().slice(0, 10);

export const formatSalary = (value) =>
  value === null || value === undefined || value === ''
    ? '-'
    : Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });

export const statusSlug = (status) => status.toLowerCase().replace(/\s+/g, '-');
