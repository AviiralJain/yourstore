"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>YOURSTORE</div>
        <h1 className={styles.title}>Reset Password</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        {message && <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '12px', borderRadius: '4px', marginBottom: '16px', textAlign: 'center', fontSize: '0.875rem' }}>{message}</div>}

        <form onSubmit={handleReset} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="admin@yourstore.com"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
