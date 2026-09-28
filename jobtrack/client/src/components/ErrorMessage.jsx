import Button from './Button';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-box" role="alert">
      <p>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
