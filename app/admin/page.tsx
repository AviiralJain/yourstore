import React from 'react';
import styles from './admin.module.css';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Project from '@/lib/models/Project';
import Category from '@/lib/models/Category';
import Enquiry from '@/lib/models/Enquiry';

export default async function AdminDashboard() {
  await connectToDatabase();
  
  // Fetch real counts from MongoDB
  const productCount = await Product.countDocuments();
  const projectCount = await Project.countDocuments();
  const categoryCount = await Category.countDocuments();
  const enquiryCount = await Enquiry.countDocuments({ status: 'NEW' });

  // Fetch 5 most recent enquiries
  const recentEnquiries = await Enquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Products</span>
          <span className={styles.statValue}>{productCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Projects</span>
          <span className={styles.statValue}>{projectCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Categories</span>
          <span className={styles.statValue}>{categoryCount}</span>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <span className={styles.statLabel}>New Enquiries</span>
          <span className={styles.statValue} style={{ color: 'var(--accent-primary)' }}>{enquiryCount}</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Enquiries</h2>
        
        {recentEnquiries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No enquiries yet.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((enq: any) => (
                  <tr key={enq._id.toString()}>
                    <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                    <td>{enq.name}</td>
                    <td>{enq.projectType}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${enq.status === 'NEW' ? styles.statusNew : enq.status === 'CLOSED' ? styles.statusClosed : styles.statusProgress}`}>
                        {enq.status}
                      </span>
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
