import React from 'react';
import CategoryForm from '../../components/CategoryForm';
import styles from '../../admin.module.css';

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add New Category</h1>
      </div>
      
      <CategoryForm />
    </div>
  );
}
