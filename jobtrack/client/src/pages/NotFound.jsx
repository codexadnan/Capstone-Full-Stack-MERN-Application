import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card center">
        <p className="notfound-code">404</p>
        <h1>Page not found</h1>
        <p className="auth-sub">The page you are looking for does not exist or was moved.</p>
        <Button to="/">Go to home</Button>
      </div>
    </div>
  );
}
