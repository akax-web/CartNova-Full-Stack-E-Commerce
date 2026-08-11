import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../api/cartApi';
import { checkout } from '../api/orderApi';
import { extractErrorMessage } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const PAYMENT_METHODS = ['CASH', 'UPI', 'CARD'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCart()
      .then((res) => setItems(res.data.data || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handlePlaceOrder() {
    setPlacingOrder(true);
    setOrderError('');
    try {
      const res = await checkout(paymentMethod);
      const orderId = res.data.data.orderId;
      navigate(`/orders/${orderId}`, { state: { justPlaced: true } });
    } catch (err) {
      setOrderError(extractErrorMessage(err));
    } finally {
      setPlacingOrder(false);
    }
  }

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  if (loading) return <div className="page container"><LoadingSpinner label="Loading checkout…" /></div>;
  if (error) return <div className="page container"><ErrorMessage message={error} /></div>;

  if (items.length === 0) {
    return (
      <div className="page container">
        <EmptyState
          title="Your cart is empty"
          description="Add products to your cart before checking out."
          actionLabel="Browse Products"
          actionTo="/"
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1>Checkout</h1>

        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Order Summary</h3>
          {items.map((item) => (
            <div key={item.cartItemId} className="flex-between" style={{ marginBottom: 10, fontSize: 14 }}>
              <span>
                {item.productName} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="price">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="receipt-divider" />
          <div className="flex-between">
            <span style={{ fontWeight: 600 }}>Total</span>
            <span className="price" style={{ fontSize: 18 }}>
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Payment Method</h3>
          <div className="payment-options">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method}
                className={`payment-option${paymentMethod === method ? ' selected' : ''}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {orderError && <ErrorMessage message={orderError} />}

        <button
          className="btn btn-primary btn-block"
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? 'Placing order…' : `Place Order · ${formatCurrency(total)}`}
        </button>
      </div>
    </div>
  );
}
