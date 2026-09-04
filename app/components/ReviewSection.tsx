"use client";

import React, { useState } from 'react';
import { Button } from './Button';
import styles from './ReviewSection.module.css';

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, reviews, averageRating, totalReviews }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', rating: 5, review: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSubmitMessage('Thank you! Your review has been submitted and is awaiting approval.');
      setShowForm(false);
      setFormData({ customerName: '', rating: 5, review: '' });
    } catch (err: any) {
      setSubmitMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.summary}>
          <div className={styles.averageRating}>
            <span className={styles.stars}>{renderStars(Math.round(averageRating))}</span>
            <span className={styles.score}>{averageRating.toFixed(1)}</span>
          </div>
          <div className={styles.totalReviews}>Based on {totalReviews} review{totalReviews !== 1 && 's'}</div>
        </div>
        
        {!showForm && !submitMessage && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {submitMessage && (
        <div className={submitMessage.startsWith('Error') ? styles.errorMessage : styles.successMessage}>
          {submitMessage}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h4 className={styles.formTitle}>Write a Review</h4>
          
          <div className={styles.formGroup}>
            <label>Name</label>
            <input 
              type="text" 
              required 
              minLength={2}
              maxLength={100}
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className={styles.input}
              placeholder="Your name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Rating</label>
            <select 
              value={formData.rating} 
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className={styles.input}
            >
              <option value="5">★★★★★ (5/5)</option>
              <option value="4">★★★★☆ (4/5)</option>
              <option value="3">★★★☆☆ (3/5)</option>
              <option value="2">★★☆☆☆ (2/5)</option>
              <option value="1">★☆☆☆☆ (1/5)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Review</label>
            <textarea 
              required
              minLength={5}
              maxLength={2000}
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              className={styles.textarea}
              placeholder="What did you like or dislike about this product?"
              rows={4}
            />
          </div>

          <div className={styles.formActions}>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.reviewsList}>
        <h3 className={styles.listTitle}>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewStars}>{renderStars(review.rating)}</span>
                <span className={styles.reviewDate}>
                  {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(review.createdAt))}
                </span>
              </div>
              <div className={styles.reviewAuthor}>{review.customerName}</div>
              <p className={styles.reviewText}>{review.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
