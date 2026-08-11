import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

function getProductImage(productId) {
  const images = {
    1: '/images/samsung-s25.jpg',
    2: '/images/iphone-16.jpg',
    3: '/images/asus-vivobook-15.jpg',
    4: '/images/hp-victus.jpg',
    5: '/images/lenovo-loq.jpg',
    6: '/images/mouse.jpg',
    7: '/images/keyboard.jpg',
    8: '/images/charger.jpg',
  };

  return images[productId];
}

export default function ProductCard({ product }) {
  const outOfStock = product.quantity <= 0;
  const image = getProductImage(product.productsId);

  return (
    <Link
      to={`/products/${product.productsId}`}
      className="product-card card"
    >
      <div className="product-card-tile">
        <img
          src={image}
          alt={product.productName}
          className="product-card-image"
        />
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">
          {product.productName}
        </h3>

        <div className="flex-between">
          <span className="price">
            {formatCurrency(product.price)}
          </span>

          {outOfStock ? (
            <span className="badge badge-danger">
              Out of stock
            </span>
          ) : (
            <span className="badge badge-success">
              In stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}