import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProduct, updateProduct, fetchAdminProductById } from '../api/adminProductApi';
import { extractErrorMessage } from '../api/axiosClient';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ productName: '', price: '', quantity: '', category: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    fetchAdminProductById(id)
      .then((res) => {
        const p = res.data.data;
        setForm({
          productName: p.productName || '',
          price: p.price ?? '',
          quantity: p.quantity ?? '',
          category: p.category ?? '',
        });
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      productName: form.productName,
      price: Number(form.price),
      quantity: Number(form.quantity),
      category: Number(form.category),
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page container"><LoadingSpinner label="Loading product…" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 480 }}>
        <Link to="/admin/products" className="text-muted" style={{ fontSize: 13.5 }}>
          ← Back to products
        </Link>

        <h1 style={{ marginTop: 16 }}>{isEdit ? 'Edit Product' : 'Add Product'}</h1>

        <div className="card" style={{ padding: 24, marginTop: 12 }}>
          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="productName">Product Name</label>
              <input
                id="productName"
                type="text"
                value={form.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="category">Category ID</label>
              <input
                id="category"
                type="number"
                min="0"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
