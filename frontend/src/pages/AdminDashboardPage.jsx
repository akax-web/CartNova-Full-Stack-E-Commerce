import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>
          Signed in as {user?.name} ({user?.email})
        </p>

        <div className="admin-tile-grid">
          <Link to="/admin/products" className="card admin-tile">
            <h3>View Products</h3>
            <p className="text-muted" style={{ marginBottom: 0 }}>
              Browse, search, edit, and delete products in the catalog.
            </p>
          </Link>

          <Link to="/admin/products/new" className="card admin-tile">
            <h3>Add Product</h3>
            <p className="text-muted" style={{ marginBottom: 0 }}>
              Add a new product to the CartNova catalog.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
