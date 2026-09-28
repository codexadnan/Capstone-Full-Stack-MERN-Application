import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatDate } from '../utils/format';

// Desktop view: table. Set `compact` to hide actions (dashboard).
export default function ApplicationTable({ applications, onDelete, compact = false }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Company</th>
            <th scope="col">Position</th>
            <th scope="col">Status</th>
            <th scope="col">Applied</th>
            {!compact && <th scope="col">Type</th>}
            {!compact && <th scope="col"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td><Link to={`/applications/${app._id}`} className="table-link">{app.company}</Link></td>
              <td>{app.position}</td>
              <td><StatusBadge status={app.status} /></td>
              <td>{formatDate(app.appliedDate)}</td>
              {!compact && <td>{app.employmentType}</td>}
              {!compact && (
                <td className="table-actions">
                  <Button variant="ghost" to={`/applications/${app._id}/edit`}>Edit</Button>
                  <Button variant="ghost" className="text-danger" onClick={() => onDelete(app)}>Delete</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
