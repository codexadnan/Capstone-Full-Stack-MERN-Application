export default function LoadingSpinner({ label = 'Loading...', fullPage = false }) {
  return (
    <div className={`loading ${fullPage ? 'loading-full' : ''}`} role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
