import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchOrderItems } from '../api/orderApi';
import { extractErrorMessage, DEMO_MODE } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    fetchOrderItems(orderId)
      .then((res) => setItems(res.data.data || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [orderId]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <Link to="/orders" className="text-muted" style={{ fontSize: 13.5 }}>
          ← Back to orders
        </Link>

        <div className="flex-between" style={{ marginTop: 16, marginBottom: 20 }}>
          <h1 style={{ marginBottom: 0 }}>Order #{orderId}</h1>
          <Link to={`/orders/${orderId}/invoice`} className="btn btn-outline btn-sm">
            View Invoice
          </Link>
        </div>

        {location.state?.justPlaced && (
          <div className="alert alert-success">
            {DEMO_MODE
              ? 'Checkout demo complete. This is a local test order. No real payment was processed.'
              : 'Your order was placed successfully.'}
          </div>
        )}

        {loading && <LoadingSpinner label="Loading order details…" />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && (
          <div className="card" style={{ padding: 20 }}>
            <div className="line-item-row line-item-header">
              <span>Product</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Amount</span>
            </div>
            {items.map((item) => (
              <div className="line-item-row" key={item.orderItemId}>
                <span>{item.productName}</span>
                <span>{item.quantity}</span>
                <span className="price">{formatCurrency(item.price)}</span>
                <span className="price">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="receipt-divider" />
            <div className="flex-between">
              <span style={{ fontWeight: 600 }}>Total</span>
              <span className="price" style={{ fontSize: 17 }}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
