"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Plus, Edit2, Check, X, ArrowUp, ArrowDown } from 'lucide-react';

type FormOption = {
  _id: string;
  group: string;
  label: string;
  value: string;
  active: boolean;
  displayOrder: number;
};

const GROUPS = [
  { id: 'project_domain', name: 'Project Domains' },
  { id: 'user_type', name: 'User Types' },
  { id: 'current_stage', name: 'Current Stage' },
  { id: 'timeline', name: 'Timeline' },
  { id: 'preferred_contact_method', name: 'Preferred Contact Method' },
  { id: 'technology', name: 'Technologies (Multi-select / Tags)' }
];

export default function FormOptionsClient() {
  const [options, setOptions] = useState<FormOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(GROUPS[0].id);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ label: '', value: '', active: true, displayOrder: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/form-options');
      if (!res.ok) throw new Error('Failed to fetch options');
      const data = await res.json();
      setOptions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string | null) => {
    try {
      if (id) {
        // Update
        const res = await fetch(`/api/admin/form-options/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm)
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        // Create
        const res = await fetch('/api/admin/form-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editForm, group: activeTab })
        });
        if (!res.ok) throw new Error('Create failed');
      }
      
      setIsEditing(null);
      setIsAdding(false);
      fetchOptions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/form-options/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      });
      if (!res.ok) throw new Error('Toggle failed');
      fetchOptions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (opt: FormOption) => {
    setIsEditing(opt._id);
    setEditForm({ label: opt.label, value: opt.value, active: opt.active, displayOrder: opt.displayOrder });
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    const groupOptions = options.filter(o => o.group === activeTab);
    const nextOrder = groupOptions.length > 0 ? Math.max(...groupOptions.map(o => o.displayOrder)) + 10 : 10;
    setEditForm({ label: '', value: '', active: true, displayOrder: nextOrder });
  };

  const activeOptions = options.filter(o => o.group === activeTab).sort((a, b) => a.displayOrder - b.displayOrder);

  if (loading) return <div className={styles.loader}>Loading form options...</div>;
  if (error) return <div className={styles.errorAlert}>{error}</div>;

  return (
    <div className={styles.card}>
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--admin-border)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {GROUPS.map(g => (
          <button 
            key={g.id}
            onClick={() => { setActiveTab(g.id); setIsAdding(false); setIsEditing(null); }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === g.id ? 'var(--accent-primary)' : 'var(--admin-text)', 
              fontWeight: activeTab === g.id ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              padding: '0.5rem'
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Label</th>
              <th>Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeOptions.map(opt => (
              <tr key={opt._id} style={{ opacity: opt.active ? 1 : 0.6 }}>
                {isEditing === opt._id ? (
                  <>
                    <td><input type="number" style={{ width: '60px', padding: '0.25rem' }} value={editForm.displayOrder} onChange={e => setEditForm({...editForm, displayOrder: parseInt(e.target.value) || 0})} /></td>
                    <td><input type="text" style={{ width: '100%', padding: '0.25rem' }} value={editForm.label} onChange={e => setEditForm({...editForm, label: e.target.value})} /></td>
                    <td><input type="text" style={{ width: '100%', padding: '0.25rem' }} value={editForm.value} onChange={e => setEditForm({...editForm, value: e.target.value})} /></td>
                    <td>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.checked})} /> Active
                      </label>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleSave(opt._id)} className={styles.primaryButton} style={{ padding: '0.25rem 0.5rem' }}><Check size={16} /></button>
                        <button onClick={() => setIsEditing(null)} className={styles.outlineButton} style={{ padding: '0.25rem 0.5rem' }}><X size={16} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{opt.displayOrder}</td>
                    <td>{opt.label}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{opt.value}</td>
                    <td>
                      <button 
                        onClick={() => handleToggleActive(opt._id, opt.active)}
                        style={{ 
                          background: opt.active ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255, 255, 255, 0.1)', 
                          color: opt.active ? 'var(--whatsapp-green)' : 'var(--admin-text-muted)',
                          border: 'none',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        {opt.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => startEdit(opt)} className={styles.viewButton} style={{ padding: '0.25rem 0.75rem' }}>
                        <Edit2 size={14} style={{ marginRight: '0.25rem' }} /> Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            
            {isAdding && (
              <tr>
                <td><input type="number" style={{ width: '60px', padding: '0.25rem' }} value={editForm.displayOrder} onChange={e => setEditForm({...editForm, displayOrder: parseInt(e.target.value) || 0})} /></td>
                <td><input type="text" placeholder="Label" style={{ width: '100%', padding: '0.25rem' }} value={editForm.label} onChange={e => setEditForm({...editForm, label: e.target.value, value: e.target.value})} /></td>
                <td><input type="text" placeholder="Value" style={{ width: '100%', padding: '0.25rem' }} value={editForm.value} onChange={e => setEditForm({...editForm, value: e.target.value})} /></td>
                <td>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={editForm.active} onChange={e => setEditForm({...editForm, active: e.target.checked})} /> Active
                  </label>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleSave(null)} className={styles.primaryButton} style={{ padding: '0.25rem 0.5rem' }}><Check size={16} /></button>
                    <button onClick={() => setIsAdding(false)} className={styles.outlineButton} style={{ padding: '0.25rem 0.5rem' }}><X size={16} /></button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {!isAdding && (
          <button onClick={startAdd} className={styles.primaryButton} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Add Option
          </button>
        )}
      </div>
    </div>
  );
}
