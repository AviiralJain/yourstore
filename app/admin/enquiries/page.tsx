import React from 'react';
import connectToDatabase from '@/lib/db/mongodb';
import Enquiry from '@/lib/models/Enquiry';
import styles from '../admin.module.css';
import EnquiryList from './EnquiryList';

export default async function AdminEnquiriesPage() {
  await connectToDatabase();
  
  const enquiries = await Enquiry.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Enquiries</h1>
      </div>

      <div className={styles.card}>
        {enquiries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No enquiries found.</p>
        ) : (
          <EnquiryList enquiries={JSON.parse(JSON.stringify(enquiries))} />
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
