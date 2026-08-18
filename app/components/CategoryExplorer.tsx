"use client";

import React, { useState } from 'react';
import styles from './CategoryExplorer.module.css';
import { categories } from '../data/categories';

export const CategoryExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(prev => prev === categoryId ? null : categoryId);
  };

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
                  <img src={category.image} alt={category.name} className={styles.cardImage} />
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
                  
                  <ul className={styles.subList}>
                    {category.subcategories.map(sub => (
                      <li key={sub.id} className={styles.subItem}>
                        <a href="#" className={styles.subLink}>[ {sub.name} ]</a>
                      </li>
                    ))}
                  </ul>

                  <a href="#" className={styles.viewAllCta}>
                    VIEW ALL {category.name} PRODUCTS &rarr;
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
