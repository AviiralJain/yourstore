"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CategoryExplorer.module.css';

export const CategoryExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(prev => prev === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <div className={styles.explorerContainer} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.explorerContainer} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Products are currently being updated.</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={styles.explorerContainer} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No categories available yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.explorerContainer}>
      <div className={styles.cardsGrid}>
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          
          return (
            <div key={category.id} className={styles.categoryColumn}>
              <div 
                className={`${styles.categoryCard} ${isActive ? styles.cardActive : ''}`}
                onClick={() => handleCategoryClick(category.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
              >
                <div className={styles.imageWrapper}>
                  {category.image ? (
                    <img src={category.image} alt={category.name} className={styles.cardImage} />
                  ) : (
                    <div className={styles.fallbackPattern}></div>
                  )}
                  <div className={styles.cardOverlay}></div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{category.name}</h3>
                  <p className={styles.cardDesc}>{category.description}</p>
                  <div className={styles.cardCta}>
                    EXPLORE {category.name} &rarr;
                  </div>
                </div>
              </div>

              {/* Subcategories Expansion */}
              <div className={`${styles.subcategoriesPanel} ${isActive ? styles.panelExpanded : ''}`}>
                <div className={styles.panelContent}>
                  <div className={styles.panelHeader}>
                    <h4>{category.name} COMPONENTS</h4>
                    <div className={styles.divider}></div>
                  </div>
                  
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <ul className={styles.subList}>
                      {category.subcategories.map((sub: any) => (
                        <li key={sub.id} className={styles.subItem}>
                          <Link href={`/categories/${category.slug}/${sub.slug}`} className={styles.subLink}>[ {sub.name} ]</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={styles.emptyState}>No subcategories yet.</div>
                  )}
                  
                  <Link href={`/categories/${category.slug}`} className={styles.viewAllCta}>
                    VIEW ALL IN {category.name} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
