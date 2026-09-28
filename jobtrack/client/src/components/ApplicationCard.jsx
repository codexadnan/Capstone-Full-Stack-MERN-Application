import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatDate } from '../utils/format';

// Mobile view: one card per application
export default function ApplicationCard({ application, onDelete, hideActions = false }) {
  return (
    <article className="app-card">
      <div className="app-card-head">
        <div>
          <h3><Link to={`/applications/${application._id}`}>{application.company}</Link></h3>
          <p>{application.position}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>
      <p className="app-card-meta">
        {application.employmentType}
        {application.location ? `, ${application.location}` : ''}
        {' - applied '}{formatDate(application.appliedDate)}
      </p>
      {!hideActions && (
        <div className="app-card-actions">
          <Button variant="secondary" to={`/applications/${application._id}/edit`}>Edit</Button>
          <Button variant="secondary" className="text-danger" onClick={() => onDelete(application)}>Delete</Button>
        </div>
      )}
    </article>
  );
}
