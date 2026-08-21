import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItemQuantity, removeCartItem } from '../api/cartApi';
import { extractErrorMessage, DEMO_MODE } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import CartItemRow from '../components/CartItemRow.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyItemId, setBusyItemId] = useState(null);
  const [actionError, setActionError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    fetchCart()
      .then((res) => setItems(res.data.data || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleUpdateQuantity(cartItemId, quantity) {
    setBusyItemId(cartItemId);
    setActionError('');
    try {
      await updateCartItemQuantity(cartItemId, quantity);
      setItems((prev) =>
        prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
      );
    } catch (err) {
      setActionError(extractErrorMessage(err));
      load(); // resync with server truth if the update failed partway
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleRemove(cartItemId) {
    setBusyItemId(cartItemId);
    setActionError('');
    try {
      await removeCartItem(cartItemId);
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusyItemId(null);
    }
  }

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  return (
    <div className="page">
      <div className="container">
        <h1>Your Cart</h1>

        {DEMO_MODE && (
          <div className="alert alert-demo" style={{ marginBottom: 20 }}>
            🛍️ <strong>Demo Mode</strong> — Your cart is stored locally in this browser.
            Checkout requires a live backend.
          </div>
        )}

        {loading && <LoadingSpinner label="Loading your cart…" />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="Your cart is empty"
            description="Browse the catalog and add something you like."
            actionLabel="Browse Products"
            actionTo="/"
          />
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {actionError && <ErrorMessage message={actionError} />}

            <div className="card" style={{ marginBottom: 24 }}>
              {items.map((item) => (
                <CartItemRow
                  key={item.cartItemId}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  busy={busyItemId === item.cartItemId}
                />
              ))}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span className="price" style={{ fontSize: 20 }}>
                  {formatCurrency(total)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link to="/" className="btn btn-outline">
                  Continue Shopping
                </Link>
                {!DEMO_MODE && (
                  <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                  </button>
                )}
                {DEMO_MODE && (
                  <button className="btn btn-primary" disabled title="Checkout requires a live backend">
                    Checkout (Demo Only)
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
