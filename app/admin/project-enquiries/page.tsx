"use client";

import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import { Search, X, Edit2 } from 'lucide-react';


interface ProjectEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  projectDomain: string;
  projectTitle?: string;
  description: string;
  currentStage?: string;
  technologies?: string;
  requirements?: string;
  timeline?: string;
  additionalInformation?: string;
  preferredContactMethod?: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'in_development' | 'completed' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  in_discussion: number;
  in_development: number;
  completed: number;
  closed: number;
}

export default function AdminProjectEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [selectedEnquiry, setSelectedEnquiry] = useState<ProjectEnquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (debouncedSearch) params.append('search', debouncedSearch);

      const res = await fetch(`/api/admin/project-enquiries?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch project enquiries');
      
      const json = await res.json();
      setEnquiries(json.enquiries);
      setStats(json.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, debouncedSearch]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const res = await fetch(`/api/admin/project-enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      const json = await res.json();
      
      // Update local state
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: json.enquiry.status } : e));
      if (selectedEnquiry?._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: json.enquiry.status });
      }
      
      setUpdateSuccess(true);
      // We should ideally refresh stats as well
      fetchData();
    } catch (err) {
      setUpdateError('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusDisplay = (status: string) => {
    const map: Record<string, string> = {
      'new': 'New',
      'contacted': 'Contacted',
      'in_discussion': 'In Discussion',
      'in_development': 'In Development',
      'completed': 'Completed',
      'closed': 'Closed'
    };
    return map[status] || status;
  };

  const closeModal = () => {
    setSelectedEnquiry(null);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>PROJECT ENQUIRIES</h1>
          <p className={styles.pageSubtitle}>Manage project requirements submitted through the VECTOR-X website.</p>
        </div>
      </div>

      {/* Summary Row */}
      {stats && (
        <div className={styles.statsSummaryRow}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>TOTAL</span>
            <span className={styles.summaryValue}>{stats.total}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>NEW</span>
            <span className={`${styles.summaryValue} ${styles.textNew}`}>{stats.new}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>CONTACTED</span>
            <span className={`${styles.summaryValue} ${styles.textContacted}`}>{stats.contacted}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>IN DISCUSSION</span>
            <span className={`${styles.summaryValue} ${styles.textDiscussion}`}>{stats.in_discussion}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>IN DEVELOPMENT</span>
            <span className={`${styles.summaryValue} ${styles.textDevelopment}`}>{stats.in_development}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>COMPLETED</span>
            <span className={`${styles.summaryValue} ${styles.textCompleted}`}>{stats.completed}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>CLOSED</span>
            <span className={`${styles.summaryValue} ${styles.textClosed}`}>{stats.closed}</span>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search enquiries..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
            className={styles.statusFilter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_discussion">In Discussion</option>
            <option value="in_development">In Development</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
      </div>

      {/* Main Content */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loader}>
            <p>Loading enquiries...</p>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>ERROR</h3>
            <p>{error}</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>
              {(searchQuery || statusFilter !== 'All') ? 'NO MATCHING ENQUIRIES' : 'NO PROJECT ENQUIRIES YET'}
            </h3>
            <p>
              {(searchQuery || statusFilter !== 'All') 
                ? 'Try changing the search or filter.' 
                : 'Project requirements submitted through the website will appear here.'}
            </p>
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>PROJECT</th>
                  <th>DOMAIN</th>
                  <th>USER TYPE</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td className={styles.fw600}>{enquiry.name}</td>
                    <td>{enquiry.projectTitle || '-'}</td>
                    <td>{enquiry.projectDomain}</td>
                    <td>{enquiry.userType}</td>
                    <td>
                      <span className={`${styles.enquiryStatus} ${styles['status' + enquiry.status]}`}>
                        {getStatusDisplay(enquiry.status)}
                      </span>
                    </td>
                    <td className={styles.textMuted}>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className={styles.viewButton}
                        onClick={() => setSelectedEnquiry(enquiry)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Enquiry Details</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3>ABOUT THE PERSON</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>Name</label>
                    <p>{selectedEnquiry.name}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Email</label>
                    <p><a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a></p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Phone</label>
                    <p><a href={`tel:${selectedEnquiry.phone}`}>{selectedEnquiry.phone}</a></p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>User Type</label>
                    <p>{selectedEnquiry.userType}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Preferred Contact</label>
                    <p>{selectedEnquiry.preferredContactMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>PROJECT</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>Project Title</label>
                    <p>{selectedEnquiry.projectTitle || 'N/A'}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Project Domain</label>
                    <p>{selectedEnquiry.projectDomain}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Current Stage</label>
                    <p>{selectedEnquiry.currentStage || 'N/A'}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Timeline</label>
                    <p>{selectedEnquiry.timeline || 'N/A'}</p>
                  </div>
                  <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <p className={styles.multiLineText}>{selectedEnquiry.description}</p>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>TECHNICAL REQUIREMENTS</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                    <label>Technologies</label>
                    <p>{selectedEnquiry.technologies || 'N/A'}</p>
                  </div>
                  <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                    <label>Requirements</label>
                    <p className={styles.multiLineText}>{selectedEnquiry.requirements || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedEnquiry.additionalInformation && (
                <div className={styles.detailSection}>
                  <h3>ADDITIONAL INFORMATION</h3>
                  <div className={styles.detailItem}>
                    <p className={styles.multiLineText}>{selectedEnquiry.additionalInformation}</p>
                  </div>
                </div>
              )}

              <div className={styles.detailSection}>
                <h3>STATUS</h3>
                <div className={styles.statusUpdateBox}>
                  <div className={styles.detailItem}>
                    <label>Current Status</label>
                    <select 
                        value={selectedEnquiry.status}
                        onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
                        disabled={updatingId === selectedEnquiry._id}
                        className={styles.statusSelect}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_discussion">In Discussion</option>
                        <option value="in_development">In Development</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    {updatingId === selectedEnquiry._id && <span className={styles.updatingText}>Updating...</span>}
                    {updateSuccess && updatingId !== selectedEnquiry._id && <span className={styles.successText}>Updated securely!</span>}
                  </div>
                  <div className={styles.detailItem}>
                    <label>Created Date</label>
                    <p>{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Last Updated</label>
                    <p>{new Date(selectedEnquiry.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
                {updateError && (
                  <div className={styles.errorAlert}>
                    {updateError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





