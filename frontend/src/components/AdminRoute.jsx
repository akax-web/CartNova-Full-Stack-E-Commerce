import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Defense-in-depth on top of the backend's own hasRole("ADMIN") check (SecurityConfig) - this
// just keeps a non-admin from ever seeing the admin UI at all, rather than letting them hit the
// page and get a 403 from every API call on it.
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = (user?.role || '').toLowerCase() === 'admin';
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
