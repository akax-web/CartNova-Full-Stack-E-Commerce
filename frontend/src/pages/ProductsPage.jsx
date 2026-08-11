import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/productApi';
import { extractErrorMessage } from '../api/axiosClient';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    fetchProducts()
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <div className="page">
      <div className="container">
        <h1>Products</h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>
          Everything currently in the CartNova catalog.
        </p>

        {loading && <LoadingSpinner label="Loading products…" />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            title="No products yet"
            description="The catalog is empty right now. Check back soon."
          />
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.productsId} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
