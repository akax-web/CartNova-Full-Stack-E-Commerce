import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../api/orderApi';
import { extractErrorMessage } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    fetchMyOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <div className="page">
      <div className="container">
        <h1>My Orders</h1>

        {loading && <LoadingSpinner label="Loading your orders…" />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && orders.length === 0 && (
          <EmptyState
            title="No orders yet"
            description="Your placed orders will show up here."
            actionLabel="Browse Products"
            actionTo="/"
          />
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="stack">
            {orders.map((order) => (
              <Link key={order.orderId} to={`/orders/${order.orderId}`} className="card order-card">
                <div className="order-meta">
                  <span className="order-id">Order #{order.orderId}</span>
                  <span className="order-date">
                    {order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}
                  </span>
                </div>
                <span className="price" style={{ fontSize: 16 }}>
                  {formatCurrency(order.totalAmount)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
