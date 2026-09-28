import Logo from '../components/Logo';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import { STATUSES } from '../utils/constants';
import { statusSlug } from '../utils/format';

const features = [
  { title: 'One list for every application', text: 'Company, role, salary, link and notes stay together instead of scattered across tabs and emails.' },
  { title: 'See where each one stands', text: 'Move an application from Applied to Offer and watch your totals update on the dashboard.' },
  { title: 'Find things fast', text: 'Search by company or position, filter by status or job type, and sort by date.' },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      <header className="landing-header">
        <Logo />
        <div className="landing-nav">
          {isAuthenticated ? (
            <Button to="/dashboard">Open dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" to="/login">Log in</Button>
              <Button to="/register">Create account</Button>
            </>
          )}
        </div>
      </header>

      <section className="hero">
        <h1>Every application, every stage, one place.</h1>
        <p>
          JobTrack keeps your job search organised. Add applications, update their status as
          you hear back, and see how your search is going at a glance.
        </p>
        <div className="hero-actions">
          <Button to={isAuthenticated ? '/dashboard' : '/register'}>
            {isAuthenticated ? 'Go to dashboard' : 'Start tracking for free'}
          </Button>
          {!isAuthenticated && <Button variant="secondary" to="/login">I already have an account</Button>}
        </div>

        <ol className="pipeline" aria-label="Application stages you can track">
          {STATUSES.map((status) => (
            <li key={status} className={`badge badge-${statusSlug(status)}`}>{status}</li>
          ))}
        </ol>
      </section>

      <section className="features">
        {features.map((feature) => (
          <article key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <footer className="landing-footer">JobTrack - a MERN stack capstone project</footer>
    </div>
  );
}
