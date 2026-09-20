"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './settings.module.css';
import { Shield, User, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck, Mail, CalendarDays, Clock, Info, Check, Circle } from 'lucide-react';

interface AdminProfile {
  email: string;
  role: string;
  isActive: boolean;
  lastPasswordChange: string | null;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.error || 'Failed to fetch settings');
        
        setProfile(json);
      } catch (err: any) {
        setProfileError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    
    setUpdatingPassword(true);
    
    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || 'Password update failed.');
      
      setPasswordSuccess('Password successfully updated! Your session has been secured. You will be redirected to log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        router.push('/admin/login');
      }, 4000);
      
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>ADMIN SETTINGS</h1>
          <p>Manage your account and security preferences.</p>
        </div>
        <div className={styles.securityStatus}>
          <ShieldCheck size={16} />
          <span>Your account is protected</span>
        </div>
      </div>

      <div className={styles.grid}>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconContainer}>
              <User size={22} />
            </div>
            <div className={styles.cardTitle}>
              <h2>ACCOUNT INFORMATION</h2>
              <p>Your account details and access information.</p>
            </div>
          </div>
          
          {loadingProfile ? (
            <div style={{ padding: '2rem 0', color: 'var(--admin-text-muted)' }}>Loading profile details...</div>
          ) : profileError ? (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{profileError}</span>
            </div>
          ) : profile ? (
            <>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Address</span>
                  <span className={styles.infoValue}>
                    <Mail size={16} style={{ color: 'var(--admin-text-muted)' }} />
                    {profile.email}
                  </span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Role</span>
                  <span className={styles.infoValue}>
                    <span className={`${styles.badge} ${styles.badgeAdmin}`}>{profile.role}</span>
                  </span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Account Status</span>
                  <span className={styles.infoValue}>
                    <span className={`${styles.badge} ${profile.isActive ? styles.badgeActive : ''}`}>
                      {profile.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member Since</span>
                  <span className={styles.infoValue}>
                    <CalendarDays size={16} style={{ color: 'var(--admin-text-muted)' }} />
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Password Change</span>
                  <span className={styles.infoValue}>
                    <Clock size={16} style={{ color: 'var(--admin-text-muted)' }} />
                    {profile.lastPasswordChange ? new Date(profile.lastPasswordChange).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>

              <div className={styles.infoCallout}>
                <Info size={18} className={styles.infoCalloutIcon} />
                <p>Need to update your email or other account details?<br />Contact the system administrator for assistance.</p>
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconContainer}>
              <Shield size={22} />
            </div>
            <div className={styles.cardTitle}>
              <h2>SECURITY & PASSWORD</h2>
              <p>Keep your account secure with a strong password.</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.formGroup}>
              <label>Current Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIconLeft} />
                <input 
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your current password"
                  required
                />
                <button 
                  type="button" 
                  className={styles.inputIconRight} 
                  onClick={() => setShowPasswords(!showPasswords)}
                  title={showPasswords ? "Hide password" : "Show password"}
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>New Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIconLeft} />
                <input 
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your new password"
                  required
                />
                <button 
                  type="button" 
                  className={styles.inputIconRight} 
                  onClick={() => setShowPasswords(!showPasswords)}
                  title={showPasswords ? "Hide password" : "Show password"}
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className={styles.requirementsPanel}>
                <div className={styles.requirementsTitle}>PASSWORD REQUIREMENTS</div>
                <div className={styles.requirementsList}>
                  <div className={`${styles.requirement} ${hasLength ? styles.met : ''}`}>
                    {hasLength ? <Check size={14} /> : <Circle size={14} />} At least 8 characters
                  </div>
                  <div className={`${styles.requirement} ${hasUpper ? styles.met : ''}`}>
                    {hasUpper ? <Check size={14} /> : <Circle size={14} />} At least one uppercase letter
                  </div>
                  <div className={`${styles.requirement} ${hasLower ? styles.met : ''}`}>
                    {hasLower ? <Check size={14} /> : <Circle size={14} />} At least one lowercase letter
                  </div>
                  <div className={`${styles.requirement} ${hasNumber ? styles.met : ''}`}>
                    {hasNumber ? <Check size={14} /> : <Circle size={14} />} At least one number
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIconLeft} />
                <input 
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Confirm your new password"
                  required
                />
                <button 
                  type="button" 
                  className={styles.inputIconRight} 
                  onClick={() => setShowPasswords(!showPasswords)}
                  title={showPasswords ? "Hide password" : "Show password"}
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{passwordError}</span>
              </div>
            )}
            
            {passwordSuccess && (
              <div className={styles.successAlert}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={updatingPassword || passwordSuccess !== null || !hasLength || !hasUpper || !hasLower || !hasNumber || !currentPassword || !confirmPassword}
            >
              <Lock size={18} />
              {updatingPassword ? 'UPDATING PASSWORD...' : 'CHANGE PASSWORD'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.securityBanner}>
        <div className={styles.securityBannerIcon}>
          <ShieldCheck size={24} />
        </div>
        <div className={styles.securityBannerText}>
          <h3>SECURITY TIPS</h3>
          <p>Use a strong, unique password and avoid sharing your credentials with anyone.</p>
        </div>
      </div>
    </div>
  );
}
