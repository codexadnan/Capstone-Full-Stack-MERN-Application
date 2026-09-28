import { useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import StatsCard from '../components/StatsCard';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationCard from '../components/ApplicationCard';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchApplications, fetchStats } from '../services/applicationService';
import { getErrorMessage } from '../services/api';

const PIPELINE = [
  { key: 'applied', label: 'Applied', color: '#5b7fa6' },
  { key: 'screening', label: 'Screening', color: '#7c6bb5' },
  { key: 'interview', label: 'Interview', color: '#c9861a' },
  { key: 'technicalTest', label: 'Technical test', color: '#c25e8a' },
  { key: 'offers', label: 'Offer', color: '#2e8b57' },
  { key: 'rejected', label: 'Rejected', color: '#c0483f' },
  { key: 'withdrawn', label: 'Withdrawn', color: '#8b959c' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, recentRes] = await Promise.all([
        fetchStats(),
        fetchApplications({ limit: 5, sort: 'newest' }),
      ]);
      setStats(statsRes.data.data);
      setRecent(recentRes.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hello, {user?.name?.split(' ')[0]}</h1>
          <p className="page-sub">Here is how your job search looks right now.</p>
        </div>
        <Button to="/applications/new">Add application</Button>
      </div>

      {loading && <LoadingSpinner label="Loading your dashboard..." />}
      <ErrorMessage message={error} onRetry={loadData} />

      {!loading && !error && stats && (
        <>
          <section className="stats-grid" aria-label="Application statistics">
            <StatsCard label="Total applications" value={stats.total} />
            <StatsCard label="Applied" value={stats.applied} tone="blue" />
            <StatsCard label="Interviews" value={stats.interview} tone="amber" />
            <StatsCard label="Offers" value={stats.offers} tone="green" />
            <StatsCard label="Rejected" value={stats.rejected} tone="red" />
          </section>

          {stats.total > 0 && (
            <section className="panel">
              <h2>Pipeline</h2>
              <div className="pipeline-bar" role="img"
                aria-label={PIPELINE.map((p) => `${p.label}: ${stats[p.key]}`).join(', ')}>
                {PIPELINE.filter((p) => stats[p.key] > 0).map((p) => (
                  <span key={p.key} style={{ flex: stats[p.key], background: p.color }} title={`${p.label}: ${stats[p.key]}`} />
                ))}
              </div>
              <ul className="legend">
                {PIPELINE.filter((p) => stats[p.key] > 0).map((p) => (
                  <li key={p.key}><i style={{ background: p.color }} />{p.label} ({stats[p.key]})</li>
                ))}
              </ul>
            </section>
          )}

          <section className="panel">
            <div className="panel-head">
              <h2>Recent applications</h2>
              {recent.length > 0 && <Button variant="ghost" to="/applications">View all</Button>}
            </div>
            {recent.length === 0 ? (
              <EmptyState
                title="No applications yet"
                message="Add your first application and it will show up here."
                action={<Button to="/applications/new">Add your first application</Button>}
              />
            ) : (
              <>
                <div className="only-desktop"><ApplicationTable applications={recent} compact /></div>
                <div className="only-mobile">
                  {recent.map((app) => <ApplicationCard key={app._id} application={app} onDelete={() => {}} hideActions />)}
                </div>
              </>
            )}
          </section>
        </>
      )}
    </>
  );
}
