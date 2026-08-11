import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="alert alert-error">
      <div>{message}</div>
      {onRetry && (
        <button
          className="btn btn-outline btn-sm"
          style={{ marginTop: 10 }}
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}
