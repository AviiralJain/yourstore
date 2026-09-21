"use client";

import React from 'react';
import styles from './ProjectDetail.module.css';
import { useLightbox } from './LightboxProvider';

export const ProjectGallery: React.FC<{ images: string[], title: string, startIndex: number }> = ({ images, title, startIndex }) => {
  const { openLightbox } = useLightbox();
  
  return (
    <div className={styles.galleryGrid}>
      {images.map((img, idx) => (
        <div key={idx} className={styles.galleryItem}>
          <img 
            src={img} 
            alt={`${title} gallery image ${idx + 1}`} 
            className={`${styles.galleryImage} ${styles.interactiveImage}`} 
            onClick={() => openLightbox(startIndex + idx)}
          />
        </div>
      ))}
    </div>
  );
};
