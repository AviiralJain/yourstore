import React from 'react';
import { Container } from './Container';
import styles from './CategoryStrip.module.css';
import Link from 'next/link';

const categories = [
  { name: 'Motors', icon: 'M12 2v20M12 12l8-4M12 12L4 8M12 12l8 4M12 12l-8 4' },
  { name: 'ESCs', icon: 'M4 12h16M8 6v12M16 6v12' },
  { name: 'Flight Controllers', icon: 'M10 6V3M14 6V3M10 21v-3M14 21v-3M6 10H3M6 14H3M21 10h-3M21 14h-3' },
  { name: 'Propellers', icon: 'M12 2L2 12l10 10 10-10L12 2z' },
  { name: 'Frames', icon: 'M12 2L2 12l10 10 10-10L12 2z' },
  { name: 'Batteries', icon: 'M10 14h4M12 12v4' },
  { name: 'FPV Systems', icon: 'M4 11a9 9 0 0 1 9 9' },
  { name: 'Sensors', icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83' },
  { name: 'View All', icon: 'M5 12h14M12 5l7 7-7 7' },
];

export const CategoryStrip: React.FC = () => {
  return (
    <div className={styles.stripWrapper}>
      <Container>
        <div className={styles.strip}>
          {categories.map((category, index) => (
            <Link href={`#category-${index}`} key={index} className={styles.item}>
              <div className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={category.icon} />
                </svg>
              </div>
              <span className={styles.name}>{category.name}</span>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};
