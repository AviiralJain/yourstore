"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './ProductCarousel.module.css';

interface ProductCarouselProps {
  children: React.ReactNode;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll by roughly one page/card
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <button 
        className={`${styles.navButton} ${styles.prevButton} ${!canScrollLeft ? styles.disabled : ''}`} 
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous products"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      <div 
        className={styles.scrollTrack} 
        ref={scrollRef}
        onScroll={checkScroll}
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className={styles.carouselItem}>
            {child}
          </div>
        ))}
      </div>

      <button 
        className={`${styles.navButton} ${styles.nextButton} ${!canScrollRight ? styles.disabled : ''}`} 
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next products"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  );
};
