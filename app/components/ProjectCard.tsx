import React from 'react';
import Image from 'next/image';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  title: string;
  projectType?: string;
  description: string;
  image?: string;
  slug?: string;
  category?: string;
  subcategory?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  projectType,
  description,
  image,
  slug,
  category,
  subcategory
}) => {
  const CardContent = (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {image ? (
          <img src={image} alt={title} className={styles.projectImage} />
        ) : (
          <div className={styles.placeholderImage}></div>
        )}
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.metaRow}>
              {category && <span className={styles.metaBadge}>{category}</span>}
              {subcategory && <span className={styles.metaBadgeSub}>{subcategory}</span>}
              {projectType && <span className={styles.client}>{projectType}</span>}
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <span className={styles.viewLink}>VIEW PROJECT &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );

  return slug ? (
    <a href={`/projects/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      {CardContent}
    </a>
  ) : CardContent;
};
