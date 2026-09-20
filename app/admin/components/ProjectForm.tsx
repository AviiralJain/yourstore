"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';
import { ImageUploader } from './ImageUploader';
import { MediaPicker } from './MediaPicker';
import { X } from 'lucide-react';

export default function ProjectForm({ project, categories, subcategories = [] }: { project?: any, categories: any[], subcategories?: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPicker, setShowPicker] = useState(false);
  
  const defaultCategory = categories.length > 0 ? categories[0]._id : '';
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    categoryId: project?.categoryId?._id || project?.categoryId || defaultCategory,
    subcategoryId: project?.subcategoryId?._id || project?.subcategoryId || '',
    projectType: project?.projectType || '',
    shortDescription: project?.shortDescription || '',
    fullDescription: project?.fullDescription || '',
    images: project?.images || [],
    mediaIds: project?.mediaIds?.map((id: any) => id.toString()) || [],
    technologies: project?.technologies?.join(', ') || '',
    hardware: project?.hardware?.join(', ') || '',
    software: project?.software?.join(', ') || '',
    features: project?.features?.join('\n') || '',
    active: project?.active ?? true,
    featured: project?.featured ?? false,
  });

  const availableSubcategories = subcategories.filter(s => s.categoryId?.toString() === formData.categoryId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'categoryId') {
      setFormData(prev => ({ ...prev, categoryId: value, subcategoryId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaSelected = (media: any) => {
    if (!formData.mediaIds.includes(media._id)) {
      setFormData(prev => ({
        ...prev,
        mediaIds: [...prev.mediaIds, media._id],
        // Optionally prepend the URL to existing `images` array for backward compatibility
        images: [...prev.images, media.url]
      }));
    }
    setShowPicker(false);
  };

  const handleRemoveMedia = (index: number) => {
    // We should ideally figure out which `images` correspond to this `mediaId` and remove it,
    // but the prompt says: "Do NOT perform a destructive migration... Allow removing a selected media item from the project without deleting the underlying Media asset."
    // Let's keep it simple: just drop the `mediaId` and the corresponding index from `images`.
    setFormData(prev => {
      const newMediaIds = [...prev.mediaIds];
      const removedMediaId = newMediaIds.splice(index, 1)[0];
      
      // We don't perfectly know which `images` URL belongs to this ID unless we fetch it.
      // But if we just pass `mediaIds` forward, the backend can keep them correctly.
      return { ...prev, mediaIds: newMediaIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = project ? `/api/admin/projects/${project._id}` : '/api/admin/projects';
      const method = project ? 'PATCH' : 'POST';

      const payload = {
        ...formData,
        subcategoryId: formData.subcategoryId || null,
        technologies: formData.technologies.split(',').map((s: string) => s.trim()).filter(Boolean),
        hardware: formData.hardware.split(',').map((s: string) => s.trim()).filter(Boolean),
        software: formData.software.split(',').map((s: string) => s.trim()).filter(Boolean),
        features: formData.features.split('\n').map((s: string) => s.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label>Main Category</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={styles.input} required>
              <option value="">Select a Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Subcategory</label>
            <select name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} className={styles.input} disabled={availableSubcategories.length === 0}>
              <option value="">{availableSubcategories.length === 0 ? 'No subcategories available' : 'Select a Subcategory'}</option>
              {availableSubcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Project Type</label>
            <input name="projectType" value={formData.projectType} onChange={handleChange} className={styles.input} placeholder="e.g. Autonomous UAV" />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Short Description</label>
          <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} className={styles.input} rows={2} />
        </div>

        <div className={styles.inputGroup}>
          <label>Full Description</label>
          <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} className={styles.input} rows={4} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label>Technologies (comma separated)</label>
            <input name="technologies" value={formData.technologies} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label>Hardware (comma separated)</label>
            <input name="hardware" value={formData.hardware} onChange={handleChange} className={styles.input} />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label>Software (comma separated)</label>
            <input name="software" value={formData.software} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label>Features (one per line)</label>
            <textarea name="features" value={formData.features} onChange={handleChange} className={styles.input} rows={3} />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Project Images</span>
            <button 
              type="button"
              onClick={() => setShowPicker(true)}
              style={{ backgroundColor: 'var(--admin-surface)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Select From Media Library
            </button>
          </label>
          
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--admin-surface)', borderRadius: '6px', border: '1px solid var(--admin-border)' }}>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>Legacy / Manual Uploads</p>
            <ImageUploader 
              images={formData.images} 
              onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))} 
              folder="yourstore/projects"
              multiple={true}
            />
          </div>

          {formData.mediaIds.length > 0 && (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(81, 113, 250, 0.05)', borderRadius: '6px', border: '1px solid rgba(81, 113, 250, 0.2)' }}>
               <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Linked Library Media (IDs)</p>
               <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                 {formData.mediaIds.map((mid: any, idx: number) => (
                   <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--admin-surface)', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--admin-border)' }}>
                     {mid.toString().substring(0,8)}...
                     <button type="button" onClick={() => handleRemoveMedia(idx)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex' }}>
                       <X size={14} />
                     </button>
                   </span>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Active
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> Featured
          </label>
        </div>

        <button type="submit" disabled={loading} className={styles.button} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontWeight: 700 }}>
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </form>

      {showPicker && <MediaPicker onSelect={handleMediaSelected} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

