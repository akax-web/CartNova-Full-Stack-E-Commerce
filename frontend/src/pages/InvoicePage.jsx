import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchInvoice } from '../api/orderApi';
import { extractErrorMessage } from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

// Matches the original console app's invoice math exactly: GST is 18% of the item subtotal,
// added on top for the grand total (see CustomerMenu.java's generateInvoice case).
const GST_RATE = 0.18;

export default function InvoicePage() {
  const { orderId } = useParams();
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    fetchInvoice(orderId)
      .then((res) => setLines(res.data.data || []))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [orderId]);

  if (loading) return <div className="page container"><LoadingSpinner label="Generating invoice…" /></div>;
  if (error) return <div className="page container"><ErrorMessage message={error} onRetry={load} /></div>;
  if (lines.length === 0) return null;

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;
  const first = lines[0];

  return (
    <div className="page">
      <div className="container">
        <Link to={`/orders/${orderId}`} className="text-muted" style={{ fontSize: 13.5 }}>
          ← Back to order
        </Link>

        <div className="receipt" style={{ marginTop: 20 }}>
          <div className="receipt-header">
            <div className="receipt-brand">CARTNOVA</div>
            <div className="receipt-sub">SMART ONLINE SHOPPING</div>
          </div>

          <div className="receipt-row">
            <span>Order #</span>
            <span>{first.orderId}</span>
          </div>
          <div className="receipt-row">
            <span>Customer</span>
            <span>{first.customerName}</span>
          </div>
          <div className="receipt-row">
            <span>Date</span>
            <span>{first.orderDate ? new Date(first.orderDate).toLocaleString() : '—'}</span>
          </div>

          <div className="receipt-divider" />

          {lines.map((line, idx) => (
            <div className="receipt-line-item" key={idx}>
              <span>
                {line.productName} × {line.quantity}
              </span>
              <span>{formatCurrency(line.price * line.quantity)}</span>
            </div>
          ))}

          <div className="receipt-divider" />

          <div className="receipt-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="receipt-row">
            <span>GST (18%)</span>
            <span>{formatCurrency(gst)}</span>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-total-row">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>

          <div className="receipt-footer">THANK YOU FOR SHOPPING WITH CARTNOVA</div>
        </div>
      </div>
    </div>
  );
}
