"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { X, Search, CheckCircle2 } from 'lucide-react';

interface MediaItem {
  _id: string;
  url: string;
  filename: string;
  title?: string;
  width: number;
  height: number;
}

export function MediaPicker({ onSelect, onClose }: { onSelect: (media: MediaItem) => void; onClose: () => void }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMedia = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `/api/admin/media?search=${encodeURIComponent(query)}` : '/api/admin/media';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setMediaList(json.media || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia(search);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%', height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Select from Media Library</h2>
          <button className={styles.closeModal} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
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

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          {loading ? (
            <div className={styles.loader}><p>Loading...</p></div>
          ) : mediaList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No media found.</p>
            </div>
          ) : (
            <div className={styles.mediaGrid}>
              {mediaList.map(media => (
                <div
                  key={media._id}
                  className={styles.mediaItem}
                  onClick={() => onSelect(media)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.mediaThumbWrapper}>
                    <img src={media.url} alt={media.filename} className={styles.mediaThumb} />
                    <div className={styles.mediaOverlay}>
                      <span className={styles.copyBtn} style={{ pointerEvents: 'none' }}>
                        Select
                      </span>
                    </div>
                  </div>
                  <div className={styles.mediaInfo}>
                    <p className={styles.mediaName}>{media.title || media.filename}</p>
                    <p className={styles.mediaDimensions}>{media.width} x {media.height} px</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
