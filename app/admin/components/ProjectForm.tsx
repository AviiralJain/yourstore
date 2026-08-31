"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';
import { ImageUploader } from './ImageUploader';

export default function ProjectForm({ project, categories }: { project?: any, categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const defaultCategory = categories.length > 0 ? categories[0].name : '';
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    category: project?.category || defaultCategory,
    client: project?.client || '',
    shortDescription: project?.shortDescription || '',
    description: project?.description || '',
    images: project?.images || [],
    isActive: project?.isActive ?? true,
    isFeatured: project?.isFeatured ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = project ? `/api/admin/projects/${project._id}` : '/api/admin/projects';
      const method = project ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/projects');
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
    <div className={styles.loginCard} style={{ maxWidth: '800px', margin: '0' }}>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label>Project Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Slug (URL friendly)</label>
            <input name="slug" value={formData.slug} onChange={handleChange} className={styles.input} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label>Main Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className={styles.input} required>
              {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              {/* Fallback for legacy categories not in DB */}
              {!categories.find(c => c.name === formData.category) && formData.category && (
                <option value={formData.category}>{formData.category}</option>
              )}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Client (Optional)</label>
            <input name="client" value={formData.client} onChange={handleChange} className={styles.input} />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Short Description</label>
          <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} className={styles.input} rows={2} />
        </div>

        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className={styles.input} rows={4} />
        </div>

        <div className={styles.inputGroup}>
          <label>Images</label>
          <ImageUploader 
            images={formData.images} 
            onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))} 
            folder="yourstore/projects"
            multiple={true}
          />
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured
          </label>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
}
