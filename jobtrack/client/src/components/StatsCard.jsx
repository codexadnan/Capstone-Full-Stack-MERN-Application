export default function StatsCard({ label, value, tone = 'neutral' }) {
  return (
    <div className={`stat stat-${tone}`}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
