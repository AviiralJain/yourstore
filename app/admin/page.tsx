"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusSquare, Briefcase, MessageSquare } from 'lucide-react';
import styles from './admin.module.css';

interface RecentEnquiry {
  _id: string;
  name: string;
  projectTitle?: string;
  projectDomain: string;
  userType: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'in_development' | 'completed' | 'closed';
  createdAt: string;
}

interface DashboardData {
  projectStats: {
    total: number;
    active: number;
    featured: number;
  };
  enquiryStats: {
    new: number;
  };
  recentEnquiries: RecentEnquiry[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (!res.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>Error Loading Dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      'new': 'New',
      'contacted': 'Contacted',
      'in_discussion': 'In Discussion',
      'in_development': 'In Development',
      'completed': 'Completed',
      'closed': 'Closed'
    };
    return statusMap[status] || status;
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Projects</span>
          <span className={styles.statValue}>{data.projectStats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Projects</span>
          <span className={styles.statValue}>{data.projectStats.active}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Featured Projects</span>
          <span className={styles.statValue}>{data.projectStats.featured}</span>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <span className={styles.statLabel}>New Enquiries</span>
          <span className={styles.statValue} style={{ color: 'var(--accent-primary)' }}>{data.enquiryStats.new}</span>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Recent Enquiries</h2>
          
          {data.recentEnquiries.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>NO PROJECT ENQUIRIES YET</h3>
              <p>Project requirements submitted through the website will appear here.</p>
            </div>
          ) : (
            <div className={styles.enquiryList}>
              {data.recentEnquiries.map((enquiry) => (
                <Link 
                  href="/admin/project-enquiries"
                  key={enquiry._id}
                  className={styles.enquiryItem}
                >
                  <div className={styles.enquiryMeta}>
                    <span className={styles.enquiryName}>{enquiry.name}</span>
                    <span className={styles.enquiryDomain}>{enquiry.projectTitle || enquiry.projectDomain} ({enquiry.userType})</span>
                    <span className={styles.enquiryDate}>
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`${styles.enquiryStatus} ${styles['status' + enquiry.status]}`}>
                    {getStatusDisplay(enquiry.status)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.quickActions}>
            <Link href="/admin/projects/new" className={styles.actionButton}>
              <PlusSquare size={18} /> Add Project
            </Link>
            <Link href="/admin/projects" className={styles.actionButton}>
              <Briefcase size={18} /> View Projects
            </Link>
            <Link href="/admin/project-enquiries" className={styles.actionButton}>
              <MessageSquare size={18} /> View Enquiries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
