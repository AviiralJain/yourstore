import React from 'react';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, icon }) => {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
