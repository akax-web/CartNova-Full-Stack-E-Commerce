import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminProducts, fetchAdminProductById, deleteProduct } from '../api/adminProductApi';
import { extractErrorMessage } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  function load() {
    setLoading(true);
    setError('');
    fetchAdminProducts()
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchId) return;
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    try {
      const res = await fetchAdminProductById(searchId);
      setSearchResult(res.data.data);
    } catch (err) {
      setSearchError(extractErrorMessage(err));
    } finally {
      setSearching(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm(`Delete product #${productId}? This cannot be undone.`)) return;
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.productsId !== productId));
      if (searchResult?.productsId === productId) setSearchResult(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <h1 style={{ marginBottom: 0 }}>Manage Products</h1>
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            + Add Product
          </Link>
        </div>

        <form onSubmit={handleSearch} className="card" style={{ padding: 16, marginBottom: 24, display: 'flex', gap: 10 }}>
          <input
            type="number"
            placeholder="Search product by ID…"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              flex: 1,
              padding: '9px 12px',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <button type="submit" className="btn btn-outline btn-sm" disabled={searching}>
            {searching ? 'Searching…' : 'Search'}
          </button>
        </form>

        {searchError && <ErrorMessage message={searchError} />}
        {searchResult && (
          <div className="card admin-row" style={{ marginBottom: 24 }}>
            <AdminProductRow product={searchResult} onDelete={handleDelete} busy={deletingId === searchResult.productsId} />
          </div>
        )}

        {loading && <LoadingSpinner label="Loading products…" />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && products.length === 0 && (
          <EmptyState title="No products yet" description="Add your first product to the catalog." actionLabel="Add Product" actionTo="/admin/products/new" />
        )}

        {!loading && !error && products.length > 0 && (
          <div className="card">
            {products.map((p) => (
              <AdminProductRow key={p.productsId} product={p} onDelete={handleDelete} busy={deletingId === p.productsId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminProductRow({ product, onDelete, busy }) {
  return (
    <div className="admin-row">
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{product.productName}</div>
        <div className="text-muted" style={{ fontSize: 12.5 }}>
          ID #{product.productsId} · Category {product.category} · Qty {product.quantity}
        </div>
      </div>
      <span className="price">{formatCurrency(product.price)}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={`/admin/products/${product.productsId}/edit`} className="btn btn-outline btn-sm">
          Edit
        </Link>
        <button
          className="btn btn-danger-outline btn-sm"
          onClick={() => onDelete(product.productsId)}
          disabled={busy}
        >
          {busy ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
