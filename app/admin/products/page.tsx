import React from 'react';
import Link from 'next/link';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import styles from '../admin.module.css';
import DeleteButton from '../components/DeleteButton';

export default async function AdminProductsPage() {
  await connectToDatabase();
  
  // Populate category name
  const products = await Product.find()
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Products</h1>
        <Link href="/admin/products/new" className={styles.button} style={{ padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: 'var(--accent-primary)', color: '#050705', borderRadius: '4px', fontWeight: 700 }}>
          + Add Product
        </Link>
      </div>

      <div className={styles.card}>
        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No products found. Add your first product!</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product._id.toString()}>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>{product.categoryId?.name || 'Unknown'}</td>
                    <td>₹{product.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${product.isActive ? styles.statusProgress : styles.statusClosed}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/products/${product._id.toString()}`} style={{ color: 'var(--accent-primary)', marginRight: '1rem', fontWeight: 600 }}>
                        Edit
                      </Link>
                      <DeleteButton endpoint="/api/admin/products" id={product._id.toString()} itemName="product" />
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
