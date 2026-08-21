import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { extractErrorMessage, DEMO_MODE } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const flashMessage = location.state?.flashMessage;
  const redirectTo = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await loginUser({ email, password });
      const userData = response.data.data; // { userId, name, email, role, token }
      login(userData);

      // Admins land on the admin dashboard regardless of where the login was triggered from -
      // there's no meaningful "cart" redirect target for an admin account.
      const isAdmin = (userData.role || '').toLowerCase() === 'admin';
      navigate(isAdmin ? '/admin' : redirectTo, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1>Welcome back</h1>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Log in to your CartNova account.
        </p>

        {DEMO_MODE && (
          <div className="alert alert-demo" style={{ marginBottom: 20 }}>
            🛍️ <strong>Demo Mode</strong> — Login requires a live backend. You can still browse
            products and add items to your cart without logging in.{' '}
            <Link to="/" style={{ color: 'inherit', textDecoration: 'underline' }}>
              Browse products →
            </Link>
          </div>
        )}

        {flashMessage && <div className="alert alert-error">{flashMessage}</div>}
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
