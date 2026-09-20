import React from 'react';
import { Metadata } from 'next';
import FormOptionsClient from './FormOptionsClient';
import styles from '../admin.module.css';

export const metadata: Metadata = {
  title: 'Form Options | VECTOR-X Admin',
};

export default function FormOptionsPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Form Options</h1>
          <p className={styles.pageDescription}>Manage selectable options for the Build Your Project form.</p>
        </div>
      </div>
      
      <FormOptionsClient />
    </div>
  );
}
