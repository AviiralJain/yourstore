"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';

export default function CategoryForm({ category }: { category?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
    isActive: category?.isActive ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = category ? `/api/admin/categories/${category._id}` : '/api/admin/categories';
      const method = category ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/categories');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginCard} style={{ maxWidth: '600px', margin: '0' }}>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Category Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className={styles.input} required />
        </div>
        
        <div className={styles.inputGroup}>
          <label>Slug (URL friendly)</label>
          <input name="slug" value={formData.slug} onChange={handleChange} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className={styles.input} rows={3} />
        </div>

        <div className={styles.inputGroup}>
          <label>Image URL</label>
          <input name="image" value={formData.image} onChange={handleChange} className={styles.input} placeholder="https://..." />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TODO: Cloudinary upload integration</p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active
          </label>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </form>
    </div>
  );
}
