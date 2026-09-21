"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './Lightbox.module.css';

interface LightboxContextType {
  openLightbox: (index: number) => void;
}

const LightboxContext = createContext<LightboxContextType>({ openLightbox: () => {} });

export const useLightbox = () => useContext(LightboxContext);

export const LightboxProvider: React.FC<{ images: { url: string; altText: string }[], children: React.ReactNode }> = ({ images, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  }, [isOpen, images.length]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      {isOpen && images.length > 0 && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)}>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close lightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          {images.length > 1 && currentIndex > 0 && (
            <button className={styles.prevBtn} onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex - 1); }} aria-label="Previous image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          )}

          <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={images[currentIndex].url} 
              alt={images[currentIndex].altText || 'Project image'}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
              priority
            />
          </div>

          {images.length > 1 && currentIndex < images.length - 1 && (
            <button className={styles.nextBtn} onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex + 1); }} aria-label="Next image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
};
