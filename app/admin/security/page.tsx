"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password updated successfully. Please log in again.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Security Settings</h1>
      </div>

      <div style={{ backgroundColor: 'var(--surface-dark)', borderRadius: '8px', padding: '24px', border: '1px solid var(--border-color)', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>Change Password</h2>
        
        {error && <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}
        {message && <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{message}</div>}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="currentPassword" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Password</label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '12px', borderRadius: '4px', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="newPassword" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>New Password</label>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '12px', borderRadius: '4px', outline: 'none' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="confirmPassword" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '12px', borderRadius: '4px', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ backgroundColor: 'var(--accent-primary)', color: '#000', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '8px' }}
          >
            {loading ? 'Updating...' : 'CHANGE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
}
