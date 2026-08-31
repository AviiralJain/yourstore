"use client";

import React, { useState, useRef } from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
  multiple?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange, folder, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const newImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // MVP Check
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
        }
        
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Image ${file.name} is too large. Please upload an image below 5MB.`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Image upload failed. Please try again.');
        }

        if (multiple) {
          newImages.push(data.url);
        } else {
          newImages[0] = data.url;
        }
      }
      onChange(multiple ? newImages : [newImages[0]]);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadBox}>
        <input 
          type="file" 
          accept="image/jpeg, image/png, image/webp"
          multiple={multiple}
          onChange={handleFileSelect}
          className={styles.fileInput}
          ref={fileInputRef}
          id={`upload-${folder}`}
          disabled={uploading}
        />
        <label htmlFor={`upload-${folder}`} className={styles.uploadLabel}>
          <div className={styles.uploadIcon}>+</div>
          <div className={styles.uploadText}>
            {uploading ? 'Uploading...' : 'Upload Images'}
          </div>
          <div className={styles.uploadHint}>JPG, PNG or WEBP up to 5MB</div>
        </label>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {images.length > 0 && (
        <div className={styles.previewContainer}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.previewItem}>
              <img src={img} alt={`Preview ${idx + 1}`} className={styles.previewImage} />
              <button 
                type="button" 
                onClick={() => handleRemove(idx)}
                className={styles.removeButton}
                aria-label="Remove image"
              >
                &times;
              </button>
              {idx === 0 && multiple && <span className={styles.primaryBadge}>Primary</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
