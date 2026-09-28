import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import { formatDate } from '../utils/format';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p className="page-sub">Your account details.</p>
        </div>
      </div>
      <section className="panel">
        <dl className="details">
          <div><dt>Name</dt><dd>{user?.name}</dd></div>
          <div><dt>Email</dt><dd>{user?.email}</dd></div>
          <div><dt>Member since</dt><dd>{formatDate(user?.createdAt)}</dd></div>
        </dl>
        <div className="form-actions">
          <Button variant="secondary" onClick={logout}>Log out</Button>
        </div>
      </section>
    </>
  );
}
