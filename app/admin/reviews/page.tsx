"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/Button';
import styles from '../admin.module.css';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setReviews(reviews.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Product Reviews</h1>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>{review.productId?.name || 'Unknown Product'}</td>
                <td>{review.customerName}</td>
                <td>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
                  {review.review.length > 100 ? review.review.substring(0, 100) + '...' : review.review}
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`status${review.status}`] || ''}`}>
                    {review.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    {review.status !== 'APPROVED' && (
                      <button 
                        onClick={() => handleUpdateStatus(review._id, 'APPROVED')}
                        className={styles.iconButton}
                        title="Approve"
                        style={{ color: '#4CAF50' }}
                      >
                        ✓
                      </button>
                    )}
                    {review.status !== 'REJECTED' && (
                      <button 
                        onClick={() => handleUpdateStatus(review._id, 'REJECTED')}
                        className={styles.iconButton}
                        title="Reject"
                        style={{ color: '#FF9800' }}
                      >
                        ✕
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(review._id)}
                      className={styles.iconButton}
                      title="Delete"
                      style={{ color: '#F44336' }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
