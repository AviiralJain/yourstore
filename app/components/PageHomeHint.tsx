import React from 'react';
import styles from './PageHomeHint.module.css';

export const PageHomeHint: React.FC = () => {
  return (
    <div className={styles.container}>
      <span className={styles.text}>Click the VECTOR-X logo to return home</span>
    </div>
  );
};
