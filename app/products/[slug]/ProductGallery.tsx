"use client";

import React, { useState } from 'react';
import styles from './ProductDetail.module.css';

export const ProductGallery: React.FC<{ images: string[], title: string }> = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState(images.length > 0 ? images[0] : null);

  if (!images || images.length === 0) {
    return (
      <div className={styles.placeholderImage}></div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageContainer}>
        <img src={activeImage!} alt={title} className={styles.mainImage} />
      </div>
      
      {images.length > 1 && (
        <div className={styles.thumbnailList}>
          {images.map((img, idx) => (
            <button 
              key={idx} 
              className={`${styles.thumbnailButton} ${activeImage === img ? styles.thumbnailActive : ''}`}
              onClick={() => setActiveImage(img)}
            >
              <img src={img} alt={`${title} ${idx + 1}`} className={styles.thumbnailImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
