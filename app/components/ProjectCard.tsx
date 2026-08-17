import React from 'react';
import Image from 'next/image';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  title: string;
  client: string;
  description: string;
  image?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  client,
  description,
  image
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {image ? (
          <img src={image} alt={title} className={styles.projectImage} />
        ) : (
          <div className={styles.placeholderImage}></div>
        )}
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            {client && <span className={styles.client}>{client}</span>}
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <span className={styles.viewLink}>View Project &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};
