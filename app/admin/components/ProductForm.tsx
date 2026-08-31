"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css'; // Reuse form styles
import { ImageUploader } from './ImageUploader';
export default function ProductForm({ product, categories, subcategories }: { product?: any, categories: any[], subcategories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    categoryId: product?.categoryId || (categories.length > 0 ? categories[0]._id : ''),
    subcategoryId: product?.subcategoryId || '',
    price: product?.price || '',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    isActive: product?.isActive ?? true,
    featured: product?.featured ?? false,
    specifications: product?.specifications || [],
    images: product?.images || [],
    stockStatus: product?.stockStatus || 'IN_STOCK',
    stockQuantity: product?.stockQuantity !== undefined ? product?.stockQuantity : ''
  });

  const availableSubcategories = subcategories.filter(sub => sub.categoryId === formData.categoryId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addSpec = () => {
    setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }));
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...formData.specifications];
    newSpecs.splice(index, 1);
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = product ? `/api/admin/products/${product._id}` : '/api/admin/products';
      const method = product ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/products');
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
            <label>Product Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Slug (URL friendly)</label>
            <input name="slug" value={formData.slug} onChange={handleChange} className={styles.input} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label>Main Category</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={styles.input} required>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Subcategory (Optional)</label>
            <select name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} className={styles.input}>
              <option value="">None</option>
              {availableSubcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Price (INR)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className={styles.input} required min="0" />
        </div>

        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>STOCK & AVAILABILITY</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label>Stock Status</label>
              <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} className={styles.input}>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Stock Quantity (Optional)</label>
              <input 
                type="number" 
                name="stockQuantity" 
                value={formData.stockQuantity} 
                onChange={handleChange} 
                className={styles.input} 
                min="0"
                placeholder={formData.stockStatus === 'OUT_OF_STOCK' ? '0' : ''}
              />
            </div>
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
          <label>Specifications</label>
          {formData.specifications.map((spec: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} placeholder="Key (e.g. KV)" className={styles.input} style={{ flex: 1 }} />
              <input value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} placeholder="Value (e.g. 1750KV)" className={styles.input} style={{ flex: 1 }} />
              <button type="button" onClick={() => removeSpec(idx)} style={{ padding: '0 0.5rem', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}>X</button>
            </div>
          ))}
          <button type="button" onClick={addSpec} style={{ padding: '0.5rem', background: 'var(--border-color)', color: 'var(--text-main)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Specification</button>
        </div>

        <div className={styles.inputGroup}>
          <label>Images</label>
          <ImageUploader 
            images={formData.images} 
            onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))} 
            folder="yourstore/products"
            multiple={true}
          />
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> Featured
          </label>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
