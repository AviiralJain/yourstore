"use client";

import React, { useState } from 'react';
import styles from '../admin.module.css';

export default function EnquiryList({ enquiries: initialEnquiries }: { enquiries: any[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Contact</th>
            <th>Project Type</th>
            <th>Requirement</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enq: any) => (
            <tr key={enq._id}>
              <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
              <td style={{ fontWeight: 500 }}>{enq.name}</td>
              <td>
                <div>{enq.phone}</div>
                {enq.email && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{enq.email}</div>}
              </td>
              <td>
                <div>{enq.projectType}</div>
                {enq.category && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{enq.category}</div>}
              </td>
              <td style={{ maxWidth: '300px' }}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                  {enq.description}
                </div>
                {(enq.budget || enq.deadline) && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {enq.budget && <span>Budget: {enq.budget}</span>}
                    {enq.budget && enq.deadline && <span style={{ margin: '0 4px' }}>|</span>}
                    {enq.deadline && <span>Deadline: {enq.deadline}</span>}
                  </div>
                )}
              </td>
              <td>
                <select 
                  value={enq.status}
                  disabled={updating === enq._id}
                  onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
