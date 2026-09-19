'use client';
import React, { useState } from 'react';
import styles from '../admin.module.css';
import { useRouter } from 'next/navigation';

interface ProjectEnquiryProps {
  enquiries: any[];
}

export default function ProjectEnquiryList({ enquiries }: ProjectEnquiryProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/project-enquiries/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Failed to update status');
    }
    setUpdatingId(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return { bg: 'rgba(234, 179, 8, 0.1)', text: '#EAB308' };
      case 'contacted': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' };
      case 'in_discussion': return { bg: 'rgba(168, 85, 247, 0.1)', text: '#A855F7' };
      case 'in_development': return { bg: 'rgba(14, 165, 233, 0.1)', text: '#0EA5E9' };
      case 'completed': return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22C55E' };
      case 'closed': return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Domain / Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enq) => (
            <tr key={enq._id}>
              <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
              <td>
                <div style={{ fontWeight: 600 }}>{enq.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{enq.email}</div>
              </td>
              <td>
                <span className={styles.badge}>{enq.projectDomain}</span>
              </td>
              <td>
                <select
                  value={enq.status}
                  onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                  disabled={updatingId === enq._id}
                  style={{
                    backgroundColor: getStatusColor(enq.status).bg,
                    color: getStatusColor(enq.status).text,
                    border: '1px solid ' + getStatusColor(enq.status).text,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    outline: 'none',
                    textTransform: 'uppercase'
                  }}
                >
                  <option value='new'>NEW</option>
                  <option value='contacted'>CONTACTED</option>
                  <option value='in_discussion'>IN DISCUSSION</option>
                  <option value='in_development'>IN DEVELOPMENT</option>
                  <option value='completed'>COMPLETED</option>
                  <option value='closed'>CLOSED</option>
                </select>
              </td>
              <td>
                <button 
                  className={styles.buttonOutline}
                  onClick={() => setSelectedEnquiry(enq)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEnquiry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedEnquiry(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
            >
              &times;
            </button>
            
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Project Details</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CONTACT</h3>
              <p><strong>Name:</strong> {selectedEnquiry.name}</p>
              <p><strong>Email:</strong> {selectedEnquiry.email}</p>
              <p><strong>Phone:</strong> {selectedEnquiry.phone}</p>
              <p><strong>User Type:</strong> {selectedEnquiry.userType}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PROJECT</h3>
              {selectedEnquiry.projectTitle && <p><strong>Title:</strong> {selectedEnquiry.projectTitle}</p>}
              <p><strong>Domain:</strong> {selectedEnquiry.projectDomain}</p>
              {selectedEnquiry.currentStage && <p><strong>Stage:</strong> {selectedEnquiry.currentStage}</p>}
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Description:</strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{selectedEnquiry.description}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TECHNICAL REQUIREMENTS</h3>
              <p><strong>Technologies:</strong> {selectedEnquiry.technologies || 'None specified'}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Requirements:</strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{selectedEnquiry.requirements || 'None specified'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PROJECT CONTEXT</h3>
              <p><strong>Timeline:</strong> {selectedEnquiry.timeline || 'Not specified'}</p>
              <p><strong>Preferred Contact:</strong> {selectedEnquiry.preferredContactMethod || 'Not specified'}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Additional Info:</strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{selectedEnquiry.additionalInformation || 'None specified'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STATUS</h3>
              <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    handleStatusChange(selectedEnquiry._id, e.target.value);
                    setSelectedEnquiry({ ...selectedEnquiry, status: e.target.value });
                  }}
                  disabled={updatingId === selectedEnquiry._id}
                  style={{
                    backgroundColor: getStatusColor(selectedEnquiry.status).bg,
                    color: getStatusColor(selectedEnquiry.status).text,
                    border: '1px solid ' + getStatusColor(selectedEnquiry.status).text,
                    padding: '0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    outline: 'none',
                    textTransform: 'uppercase',
                    width: '100%'
                  }}
                >
                  <option value='new'>NEW</option>
                  <option value='contacted'>CONTACTED</option>
                  <option value='in_discussion'>IN DISCUSSION</option>
                  <option value='in_development'>IN DEVELOPMENT</option>
                  <option value='completed'>COMPLETED</option>
                  <option value='closed'>CLOSED</option>
                </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

