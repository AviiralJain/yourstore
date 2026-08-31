import React from 'react';
import connectToDatabase from '@/lib/db/mongodb';
import StockNotification from '@/lib/models/StockNotification';
import Product from '@/lib/models/Product';
import styles from '../admin.module.css';

export default async function AdminStockNotificationsPage() {
  await connectToDatabase();
  
  // Need to call Product.init() to ensure it's registered for populate
  Product.init();
  
  const notifications = await StockNotification.find()
    .populate('productId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Stock Notifications</h1>
      </div>

      <div className={styles.card}>
        {notifications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No stock notifications found.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Customer Email</th>
                  <th>Name / Phone</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif: any) => (
                  <tr key={notif._id.toString()}>
                    <td style={{ fontWeight: 500 }}>
                      {notif.productId?.name || 'Unknown Product'}
                    </td>
                    <td>{notif.email}</td>
                    <td>
                      <div>{notif.customerName || '-'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{notif.phone || '-'}</div>
                    </td>
                    <td>{new Date(notif.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${notif.status === 'WAITING' ? styles.statusClosed : styles.statusProgress}`}>
                        {notif.status}
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
