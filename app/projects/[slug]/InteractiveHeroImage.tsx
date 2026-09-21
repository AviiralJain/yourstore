"use client";

import React from 'react';
import { useLightbox } from './LightboxProvider';
import styles from './ProjectDetail.module.css';

export const InteractiveHeroImage = ({ url, alt }: { url: string; alt: string }) => {
  const { openLightbox } = useLightbox();
  return (
    <img 
      src={url} 
      alt={alt} 
      className={`${styles.heroImage} ${styles.interactiveImage}`} 
      onClick={() => openLightbox(0)}
    />
  );
};
