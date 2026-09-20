"use client";

import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import { Search, Plus, Edit2, Trash2, ChevronDown, ChevronRight, AlertCircle, X } from 'lucide-react';

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  isActive: boolean;
  projectCount: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  projectCount: number;
  subcategoryCount: number;
  subcategories: Subcategory[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  // Modals state
  const [modalType, setModalType] = useState<'category' | 'subcategory' | null>(null);
  const [modalAction, setModalAction] = useState<'create' | 'edit' | null>(null);
  const [modalData, setModalData] = useState<any>(null); // For editing, contains original item
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(null); // For creating subcategory

  // Form state
  const [formData, setFormData] = useState({ name: '', slug: '', isActive: true });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [deleteData, setDeleteData] = useState<{type: 'category' | 'subcategory', id: string, name: string} | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tree: 'true' });
      if (debouncedSearch) params.append('search', debouncedSearch);

      const res = await fetch(`/api/admin/categories?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch categories');

      const data = await res.json();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [debouncedSearch]);

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openFormModal = (type: 'category' | 'subcategory', action: 'create' | 'edit', data?: any, parentId?: string) => {
    setModalType(type);
    setModalAction(action);
    setModalData(data || null);
    setParentCategoryId(parentId || null);
    setFormError(null);

    if (action === 'edit' && data) {
      setFormData({ name: data.name, slug: data.slug, isActive: data.isActive });
    } else {
      setFormData({ name: '', slug: '', isActive: true });
    }
  };

  const closeFormModal = () => {
    setModalType(null);
    setModalAction(null);
  };

  const openDeleteModal = (type: 'category' | 'subcategory', id: string, name: string) => {
    setDeleteData({ type, id, name });
    setDeleteError(null);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: modalAction === 'create' ? generateSlug(name) : prev.slug
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const endpoint = modalType === 'category' ? '/api/admin/categories' : '/api/admin/subcategories';
      const url = modalAction === 'edit' ? `${endpoint}/${modalData._id}` : endpoint;
      const method = modalAction === 'edit' ? 'PATCH' : 'POST';

      const payload: any = { ...formData };
      if (modalType === 'subcategory' && modalAction === 'create') {
        payload.categoryId = parentCategoryId;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Operation failed');

      await fetchCategories();
      closeFormModal();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const endpoint = deleteData.type === 'category' ? '/api/admin/categories' : '/api/admin/subcategories';
      const res = await fetch(`${endpoint}/${deleteData.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete');

      await fetchCategories();
      setDeleteData(null);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>CATEGORIES</h1>
          <p className={styles.pageSubtitle}>Manage engineering project categories and subcategories.</p>
        </div>
        <button
          className={`${styles.button} ${styles.primaryButton}`}
          onClick={() => openFormModal('category', 'create')}
        >
          <Plus size={16} style={{ marginRight: '6px' }} /> Add Category
        </button>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search categories..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loader}><p>Loading categories...</p></div>
        ) : error ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>ERROR</h3>
            <p>{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>
              {searchQuery ? 'NO MATCHING CATEGORIES' : 'NO CATEGORIES YET'}
            </h3>
            <p>
              {searchQuery
                ? 'Try changing the search terms.'
                : 'Create your first engineering project category to organize the portfolio.'}
            </p>
          </div>
        ) : (
          <div className={styles.categoryList}>
            {categories.map((cat) => (
              <div key={cat._id} className={styles.categoryGroup}>
                <div className={styles.categoryHeader}>
                  <div className={styles.catInfo} onClick={() => toggleExpand(cat._id)}>
                    <button className={styles.expandBtn}>
                      {expandedCats[cat._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <div>
                      <span className={styles.catName}>{cat.name}</span>
                      <span className={styles.catSlug}>/{cat.slug}</span>
                    </div>
                  </div>
                  <div className={styles.catMeta}>
                    <span className={styles.countBadge}>Projects: {cat.projectCount}</span>
                    <span className={styles.countBadge}>Subcategories: {cat.subcategoryCount}</span>
                    <span className={`${styles.statusBadge} ${cat.isActive ? styles.statusActive : styles.statusInactive}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className={styles.catActions}>
                    <button className={styles.iconBtn} onClick={() => openFormModal('category', 'edit', cat)} title="Edit Category"><Edit2 size={16} /></button>
                    <button className={styles.iconBtn} onClick={() => openFormModal('subcategory', 'create', null, cat._id)} title="Add Subcategory"><Plus size={16} /></button>
                    <button className={styles.iconBtnDanger} onClick={() => openDeleteModal('category', cat._id, cat.name)} title="Delete Category"><Trash2 size={16} /></button>
                  </div>
                </div>

                {expandedCats[cat._id] && (
                  <div className={styles.subcategoriesContainer}>
                    {cat.subcategories.length === 0 ? (
                      <div className={styles.subEmpty}>
                        <p>NO SUBCATEGORIES</p>
                        <span>Add a subcategory to organize projects within this category.</span>
                      </div>
                    ) : (
                      <div className={styles.subList}>
                        {cat.subcategories.map(sub => (
                          <div key={sub._id} className={styles.subItem}>
                            <div className={styles.subInfo}>
                              <div className={styles.treeLine}></div>
                              <span className={styles.subName}>{sub.name}</span>
                              <span className={styles.catSlug}>/{sub.slug}</span>
                            </div>
                            <div className={styles.subMeta}>
                              <span className={styles.countBadge}>Projects: {sub.projectCount}</span>
                              <span className={`${styles.statusBadge} ${sub.isActive ? styles.statusActive : styles.statusInactive}`}>
                                {sub.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className={styles.catActions}>
                              <button className={styles.iconBtn} onClick={() => openFormModal('subcategory', 'edit', sub)} title="Edit Subcategory"><Edit2 size={14} /></button>
                              <button className={styles.iconBtnDanger} onClick={() => openDeleteModal('subcategory', sub._id, sub.name)} title="Delete Subcategory"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {modalType && (
        <div className={styles.modalOverlay} onClick={closeFormModal}>
          <div className={styles.modalContentSmall} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{modalAction === 'create' ? 'Add' : 'Edit'} {modalType === 'category' ? 'Category' : 'Subcategory'}</h2>
              <button className={styles.closeButton} onClick={closeFormModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required type="text" value={formData.name} onChange={handleNameChange} className={styles.inputField} placeholder="e.g. Robotics & Automation" />
              </div>
              <div className={styles.formGroup}>
                <label>Slug</label>
                <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className={styles.inputField} placeholder="e.g. robotics-automation" />
              </div>
              <div className={styles.formGroupCheck}>
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                <label htmlFor="isActive">Active</label>
              </div>
              {formError && <div className={styles.errorAlert}>{formError}</div>}
              <div className={styles.modalFooter}>
                <button type="button" onClick={closeFormModal} className={styles.secondaryButton}>Cancel</button>
                <button type="submit" disabled={submitting} className={`${styles.button} ${styles.primaryButton}`}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteData && (
        <div className={styles.modalOverlay} onClick={() => setDeleteData(null)}>
          <div className={styles.modalContentSmall} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4444' }}>
                <AlertCircle size={20} /> Delete {deleteData.type}
              </h2>
              <button className={styles.closeButton} onClick={() => setDeleteData(null)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete <strong>{deleteData.name}</strong>?</p>
              {deleteError && (
                <div className={styles.errorAlert}>
                  <strong>CANNOT DELETE {deleteData.type.toUpperCase()}</strong><br/>
                  {deleteError}
                </div>
              )}
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setDeleteData(null)} className={styles.secondaryButton}>Cancel</button>
                <button type="button" onClick={handleDelete} disabled={deleting} className={`${styles.button} ${styles.dangerButton}`}>
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
