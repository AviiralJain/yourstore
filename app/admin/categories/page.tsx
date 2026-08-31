import React from 'react';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import styles from '../admin.module.css';
import Link from 'next/link';
import DeleteButton from '../components/DeleteButton';

export default async function AdminCategoriesPage() {
  await connectToDatabase();
  
  const categories = await Category.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Categories</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/subcategories" className={styles.button} style={{ padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', fontWeight: 600 }}>
            Manage Subcategories
          </Link>
          <Link href="/admin/categories/new" className={styles.button} style={{ padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: 'var(--accent-primary)', color: '#050705', borderRadius: '4px', fontWeight: 700 }}>
            + Add Category
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No categories found.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category: any) => (
                  <tr key={category._id.toString()}>
                    <td style={{ fontWeight: 500 }}>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${category.isActive ? styles.statusProgress : styles.statusClosed}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/categories/${category._id}`} style={{ color: 'var(--accent-primary)', marginRight: '1rem', fontWeight: 600 }}>
                        Edit
                      </Link>
                      <DeleteButton endpoint="/api/admin/categories" id={category._id.toString()} itemName="category" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
