import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  return (
    <span className={`${styles.badge} ${styles[`variant-${variant}`]}`}>
      {children}
    </span>
  );
};
