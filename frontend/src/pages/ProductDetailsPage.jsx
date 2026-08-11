import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { extractErrorMessage } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [added, setAdded] = useState(false);

  function load() {
    setLoading(true);
    setError('');
    fetchProductById(id)
      .then((res) => setProduct(res.data.data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    setAdding(true);
    setAddError('');
    setAdded(false);
    try {
      await addToCart(product.productsId, quantity);
      setAdded(true);
    } catch (err) {
      setAddError(extractErrorMessage(err));
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <div className="page container"><LoadingSpinner label="Loading product…" /></div>;
  if (error) return <div className="page container"><ErrorMessage message={error} onRetry={load} /></div>;
  if (!product) return null;

  const outOfStock = product.quantity <= 0;

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="text-muted" style={{ fontSize: 13.5 }}>
          ← Back to products
        </Link>

        <div className="product-detail" style={{ marginTop: 20 }}>
          <div
            className="product-detail-tile"
            style={{ background: 'linear-gradient(135deg, #eef0fb, #f2e6cf)' }}
          >
            <span>{product.productName?.charAt(0) || '?'}</span>
          </div>

          <div>
            <h1>{product.productName}</h1>
            <div className="price" style={{ fontSize: 26, marginBottom: 12 }}>
              {formatCurrency(product.price)}
            </div>

            {outOfStock ? (
              <span className="badge badge-danger">Out of stock</span>
            ) : (
              <span className="badge badge-success">{product.quantity} in stock</span>
            )}

            <div style={{ marginTop: 28 }}>
              {addError && <ErrorMessage message={addError} />}
              {added && <div className="alert alert-success">Added to cart.</div>}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                <div className="cart-row-qty">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={outOfStock}
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                    disabled={outOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={outOfStock || adding}
              >
                {outOfStock ? 'Out of stock' : adding ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
