import React from 'react';
import connectToDatabase from '@/lib/db/mongodb';
import ProjectEnquiry from '@/lib/models/ProjectEnquiry';
import styles from '../admin.module.css';
import ProjectEnquiryList from './ProjectEnquiryList';

export default async function AdminProjectEnquiriesPage() {
  await connectToDatabase();
  
  const enquiries = await ProjectEnquiry.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Project Enquiries</h1>
      </div>

      <div className={styles.card}>
        {enquiries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No project enquiries found.</p>
        ) : (
          <ProjectEnquiryList enquiries={JSON.parse(JSON.stringify(enquiries))} />
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

