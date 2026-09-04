"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../login/login.module.css';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logo}>YOURSTORE</div>
          <h1 className={styles.title}>Password Reset</h1>
          <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
            Password reset successfully! Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>YOURSTORE</div>
        <h1 className={styles.title}>Create New Password</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleReset} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number.</span>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading || !token} className={styles.button}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href="/admin/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className={styles.loginContainer}><div className={styles.title}>Loading...</div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
