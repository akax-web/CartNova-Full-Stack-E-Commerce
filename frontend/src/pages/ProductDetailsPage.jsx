import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { extractErrorMessage, DEMO_MODE } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

// Map of productId → image path relative to the public directory.
// Vite rewrites static public assets with the configured base path, so
// we use absolute-from-root paths here (Vite handles the prefix).
const PRODUCT_IMAGES = {
  1: 'images/samsung-s25.jpg',
  2: 'images/iphone-16.jpg',
  3: 'images/asus-vivobook-15.jpg',
  4: 'images/hp-victus.jpg',
  5: 'images/lenovo-loq.jpg',
  6: 'images/mouse.jpg',
  7: 'images/keyboard.jpg',
  8: 'images/charger.jpg',
};

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
    // In live-backend mode: require login.
    if (!DEMO_MODE && !isAuthenticated) {
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
  const imageSrc = PRODUCT_IMAGES[product.productsId];

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="text-muted" style={{ fontSize: 13.5 }}>
          ← Back to products
        </Link>

        <div className="product-detail" style={{ marginTop: 20 }}>
          <div className="product-detail-tile">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.productName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
              />
            ) : (
              <span>{product.productName?.charAt(0) || '?'}</span>
            )}
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

            {product.description && (
              <p className="text-muted" style={{ marginTop: 16, lineHeight: 1.6 }}>
                {product.description}
              </p>
            )}

            <div style={{ marginTop: 28 }}>
              {addError && <ErrorMessage message={addError} />}
              {added && (
                <div className="alert alert-success">
                  Added to cart.{' '}
                  <Link to="/cart" style={{ color: 'inherit', textDecoration: 'underline' }}>
                    View cart →
                  </Link>
                </div>
              )}

              {DEMO_MODE && (
                <div className="alert alert-demo" style={{ marginBottom: 16 }}>
                  🛍️ <strong>Demo Mode</strong> — Cart is stored locally in your browser.
                </div>
              )}

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
