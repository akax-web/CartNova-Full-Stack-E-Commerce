import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

export default function CartItemRow({ item, onUpdateQuantity, onRemove, busy }) {
  const [quantity, setQuantity] = useState(item.quantity);

  function commitQuantity(nextQty) {
    const safeQty = Math.max(1, nextQty);
    setQuantity(safeQty);
    if (safeQty !== item.quantity) {
      onUpdateQuantity(item.cartItemId, safeQty);
    }
  }

  const lineTotal = (item.price || 0) * quantity;

  return (
    <div className="cart-row">
      <div
        className="cart-row-tile"
        style={{ background: 'linear-gradient(135deg, #eef0fb, #e1e3ee)' }}
      >
        {item.productName?.charAt(0) || '?'}
      </div>

      <div className="cart-row-info">
        <div className="cart-row-name">{item.productName}</div>
        <div className="text-muted price" style={{ fontSize: 13 }}>
          {formatCurrency(item.price)} each
        </div>
      </div>

      <div className="cart-row-qty">
        <button
          className="qty-btn"
          onClick={() => commitQuantity(quantity - 1)}
          disabled={busy || quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="qty-value">{quantity}</span>
        <button
          className="qty-btn"
          onClick={() => commitQuantity(quantity + 1)}
          disabled={busy}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="cart-row-total price">{formatCurrency(lineTotal)}</div>

      <button
        className="btn btn-danger-outline btn-sm"
        onClick={() => onRemove(item.cartItemId)}
        disabled={busy}
      >
        Remove
      </button>
    </div>
  );
}
