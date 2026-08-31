import React from 'react';
import connectToDatabase from '@/lib/db/mongodb';
import Subcategory from '@/lib/models/Subcategory';
import styles from '../admin.module.css';
import Link from 'next/link';
import DeleteButton from '../components/DeleteButton';

export default async function AdminSubcategoriesPage() {
  await connectToDatabase();
  
  const subcategories = await Subcategory.find().populate('categoryId', 'name').sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Subcategories</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/categories" className={styles.button} style={{ padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', fontWeight: 600 }}>
            Back to Categories
          </Link>
          <Link href="/admin/subcategories/new" className={styles.button} style={{ padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: 'var(--accent-primary)', color: '#050705', borderRadius: '4px', fontWeight: 700 }}>
            + Add Subcategory
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {subcategories.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No subcategories found.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Parent Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((sub: any) => (
                  <tr key={sub._id.toString()}>
                    <td style={{ fontWeight: 500 }}>{sub.name}</td>
                    <td>{sub.categoryId?.name || 'Unknown'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${sub.isActive ? styles.statusProgress : styles.statusClosed}`}>
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/subcategories/${sub._id}`} style={{ color: 'var(--accent-primary)', marginRight: '1rem', fontWeight: 600 }}>
                        Edit
                      </Link>
                      <DeleteButton endpoint="/api/admin/subcategories" id={sub._id.toString()} itemName="subcategory" />
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
