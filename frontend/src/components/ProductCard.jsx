import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';

// Paths are relative to the public/ directory.
// Vite automatically prepends the configured base (e.g. /CartNova-Full-Stack-E-Commerce/)
// when using the import.meta.env.BASE_URL prefix.
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

function getProductImage(productId) {
  const filename = PRODUCT_IMAGES[productId];
  if (!filename) return null;
  // import.meta.env.BASE_URL is injected by Vite at build time.
  // In development it is '/', in GitHub Pages it is '/CartNova-Full-Stack-E-Commerce/'.
  return `${import.meta.env.BASE_URL}${filename}`;
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
        {image ? (
          <img
            src={image}
            alt={product.productName}
            className="product-card-image"
          />
        ) : (
          <span className="product-card-initial">
            {product.productName?.charAt(0) || '?'}
          </span>
        )}
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