"use client";

import React, { useState } from 'react';
import { Button } from './Button';
import styles from './StockNotificationForm.module.css';

interface Props {
  productId: string;
  productName: string;
}

export const StockNotificationForm: React.FC<Props> = ({ productId, productName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    customerName: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stock-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="primary" size="lg" fullWidth onClick={() => setIsOpen(true)}>
        NOTIFY ME WHEN AVAILABLE
      </Button>
    );
  }

  if (success) {
    return (
      <div className={styles.successBox}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#4CAF50' }}>✓ You're on the list.</h4>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>We'll notify you when {productName} is available.</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h4 style={{ margin: '0 0 0.5rem 0' }}>Notify me when this product is back in stock.</h4>
      {error && <div style={{ color: '#F44336', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Email *</label>
          <input 
            type="email" 
            required
            value={formData.email} 
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            className={styles.input}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Name (optional)</label>
          <input 
            type="text" 
            value={formData.customerName} 
            onChange={e => setFormData(p => ({ ...p, customerName: e.target.value }))}
            className={styles.input}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Phone (optional)</label>
          <input 
            type="tel" 
            value={formData.phone} 
            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
            className={styles.input}
            placeholder="+91 9876543210"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Button variant="primary" type="submit" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Submitting...' : 'NOTIFY ME'}
          </Button>
          <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
