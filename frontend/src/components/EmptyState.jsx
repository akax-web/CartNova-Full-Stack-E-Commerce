import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="card text-center" style={{ padding: '56px 24px' }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      {description && <p className="text-muted">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary" style={{ marginTop: 8 }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
