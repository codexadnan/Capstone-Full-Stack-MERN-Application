// Placeholder rows shown while a list is loading
export default function Skeleton({ rows = 5 }) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-row">
          <span className="skeleton skeleton-lg" />
          <span className="skeleton skeleton-md" />
          <span className="skeleton skeleton-sm" />
        </div>
      ))}
    </div>
  );
}
