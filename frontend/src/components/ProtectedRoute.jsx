import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_MODE } from '../api/axiosClient';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // In demo mode (no backend) we allow cart access without login.
  // Auth-required pages like Orders and Checkout still redirect to login
  // where the user will see a "demo mode" notice.
  if (!DEMO_MODE && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
