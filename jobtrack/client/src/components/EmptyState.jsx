export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <rect x="8" y="14" width="40" height="30" rx="5" stroke="#9fb3ae" strokeWidth="2" />
        <path d="M20 14v-3a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3" stroke="#9fb3ae" strokeWidth="2" />
        <path d="M8 27h40" stroke="#9fb3ae" strokeWidth="2" />
      </svg>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
