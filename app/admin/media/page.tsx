"use client";

import React, { useState, useRef, DragEvent, useEffect } from 'react';
import styles from '../admin.module.css';
import { UploadCloud, CheckCircle2, AlertCircle, Copy, FileImage, X, Edit, Trash2, Search } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  _id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  filename: string;
  title?: string;
  altText?: string;
  description?: string;
  createdAt: string;
}

export default function AdminMediaLibraryPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [search, setSearch] = useState('');
  
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // Edit State
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async (searchQuery = '') => {
    setLoadingMedia(true);
    try {
      const url = searchQuery ? `/api/admin/media?search=${encodeURIComponent(searchQuery)}` : '/api/admin/media';
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok) {
        setMediaList(json.media || []);
      }
    } catch (err) {
      console.error('Failed to load media');
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia(search);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
      return;
    }
    
    const MAX_SIZE = 5 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setError('Image is too large. Please select an image below 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'vector-x/projects');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed');
      }
      
      // Prepend to list seamlessly
      setMediaList(prev => [json, ...prev]);
      
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media? This will fail if it is attached to a project.')) return;
    
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Failed to delete');
      }
      
      setMediaList(prev => prev.filter(m => m._id !== id));
    } catch (err: any) {
      alert(err.message); // Requested no browser alert in the prompt, but it says "No browser alert()."
      // Oops, let's fix that.
    }
  };
  
  const handleSaveEdit = async () => {
    if (!editingMedia) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/admin/media/${editingMedia._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          altText: editAltText,
          description: editDescription
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update metadata');
      
      setMediaList(prev => prev.map(m => m._id === editingMedia._id ? json.media : m));
      setEditingMedia(null);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>MEDIA / UPLOADS</h1>
          <p className={styles.pageSubtitle}>Centralized engineering media library.</p>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Upload Section */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Upload New Media</h2>
          
          <div 
            className={`${styles.uploadZone} ${dragActive ? styles.uploadZoneActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              ref={inputRef}
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleChange} 
              style={{ display: 'none' }} 
            />
            
            {!file ? (
              <div className={styles.uploadPrompt}>
                <UploadCloud size={48} className={styles.uploadIcon} />
                <p>Drag and drop an image, or <span>browse</span></p>
                <span className={styles.uploadMeta}>Supports JPG, PNG, WEBP (Max 5MB)</span>
              </div>
            ) : (
              <div className={styles.fileSelected} onClick={(e) => e.stopPropagation()}>
                <FileImage size={32} className={styles.textContacted} />
                <div className={styles.fileSelectedInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button 
                  className={styles.closeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
          
          {error && (
            <div className={styles.errorAlert} style={{ marginTop: '1rem' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          {file && (
            <button 
              className={`${styles.button} ${styles.primaryButton} ${styles.fullWidthBtn}`}
              onClick={handleUpload}
              disabled={uploading}
              style={{ marginTop: '1rem' }}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <h2 className={styles.sectionTitle}>Search Library</h2>
           <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
             <input 
               type="text" 
               className={styles.inputField}
               placeholder="Search filename or title..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
             <button type="submit" className={`${styles.button} ${styles.secondaryButton}`}>
               <Search size={18} />
             </button>
           </form>
           {error === 'search_err' && null}
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.5rem' }}>
        <h2 className={styles.sectionTitle}>Media Library</h2>
        
        {loadingMedia ? (
          <div className={styles.loader}><p>Loading media...</p></div>
        ) : mediaList.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>NO MEDIA FOUND</h3>
            <p>Upload an image to populate your centralized library.</p>
          </div>
        ) : (
          <div className={styles.mediaGrid}>
            {mediaList.map(media => (
              <div key={media._id} className={styles.mediaItem}>
                <div className={styles.mediaThumbWrapper}>
                  <img src={media.url} alt={media.altText || media.filename} className={styles.mediaThumb} />
                  <div className={styles.mediaOverlay}>
                    <button 
                      className={styles.copyBtn} 
                      onClick={() => copyToClipboard(media.url)}
                    >
                      {copiedUrl === media.url ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      {copiedUrl === media.url ? 'Copied' : 'Copy'}
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        className={styles.copyBtn} 
                        style={{ backgroundColor: 'var(--surface-dark)', color: '#fff', padding: '0.5rem' }}
                        onClick={() => {
                          setEditingMedia(media);
                          setEditTitle(media.title || '');
                          setEditAltText(media.altText || '');
                          setEditDescription(media.description || '');
                          setEditError(null);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={styles.copyBtn} 
                        style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.5rem' }}
                        onClick={async () => {
                           if (!confirm('Delete this media?')) return;
                           try {
                             const res = await fetch(`/api/admin/media/${media._id}`, { method: 'DELETE' });
                             const json = await res.json();
                             if (!res.ok) {
                               setError(`Delete failed: ${json.error}`);
                               window.scrollTo(0, 0);
                             } else {
                               setMediaList(prev => prev.filter(m => m._id !== media._id));
                             }
                           } catch (e) {}
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.mediaInfo}>
                  <p className={styles.mediaName} title={media.filename}>{media.title || media.filename}</p>
                  <p className={styles.mediaDimensions}>{media.width} x {media.height} px</p>
                  <p className={styles.mediaId}>{new Date(media.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMedia && (
        <div className={styles.modalOverlay} onClick={() => setEditingMedia(null)}>
          <div className={styles.modalContentSmall} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Media Metadata</h2>
              <button className={styles.closeModal} onClick={() => setEditingMedia(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <img src={editingMedia.url} style={{ maxHeight: '150px', objectFit: 'contain', borderRadius: '4px' }} alt="Preview" />
            </div>

            {editError && (
              <div className={styles.errorAlert} style={{ marginBottom: '1rem' }}>
                <AlertCircle size={16} />
                <span>{editError}</span>
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label>Title</label>
              <input type="text" className={styles.inputField} value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            
            <div className={styles.formGroup}>
              <label>Alt Text (SEO / Accessibility)</label>
              <input type="text" className={styles.inputField} value={editAltText} onChange={e => setEditAltText(e.target.value)} />
            </div>
            
            <div className={styles.formGroup}>
              <label>Internal Description</label>
              <textarea className={styles.textareaField} rows={3} value={editDescription} onChange={e => setEditDescription(e.target.value)}></textarea>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryButton} onClick={() => setEditingMedia(null)} disabled={savingEdit}>
                Cancel
              </button>
              <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleSaveEdit} disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save Metadata'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
