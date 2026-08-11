import React from 'react';

export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div style={styles.wrap} role="status" aria-live="polite">
      <div style={styles.spinner} />
      <span style={styles.label}>{label}</span>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '48px 0',
    color: 'var(--color-ink-muted)',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2.5px solid var(--color-border)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'cartnova-spin 0.7s linear infinite',
  },
  label: {
    fontSize: 14,
  },
};

// Inject the keyframes once (kept local to this file rather than global.css since it's the
// only place spin is used).
if (typeof document !== 'undefined' && !document.getElementById('cartnova-spin-kf')) {
  const style = document.createElement('style');
  style.id = 'cartnova-spin-kf';
  style.textContent = '@keyframes cartnova-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}
