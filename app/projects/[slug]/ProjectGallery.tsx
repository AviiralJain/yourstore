"use client";

import React, { useState } from 'react';
import styles from './ProjectDetail.module.css';

export const ProjectGallery: React.FC<{ images: string[], title: string }> = ({ images, title }) => {
  return (
    <div className={styles.galleryGrid}>
      {images.map((img, idx) => (
        <div key={idx} className={styles.galleryItem}>
          <img src={img} alt={`${title} gallery image ${idx + 1}`} className={styles.galleryImage} />
        </div>
      ))}
    </div>
  );
};
