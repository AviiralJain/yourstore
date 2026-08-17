import React from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { Button } from './Button';

interface ProductCardProps {
  title: string;
  category: string;
  price: string;
  specs: { label: string; value: string }[];
  image?: string;
  onEnquire?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  category,
  price,
  specs,
  image,
  onEnquire
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {image ? (
          <img src={image} alt={title} className={styles.productImage} />
        ) : (
          <div className={styles.placeholderImage}></div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.category}>{category}</span>
          {price && <span className={styles.price}>{price}</span>}
        </div>
        <h3 className={styles.title}>{title}</h3>
        
        {specs.length > 0 && (
          <div className={styles.specs}>
            {specs.map((spec, index) => (
              <div key={index} className={styles.specItem}>
                <span className={styles.specLabel}>{spec.label}:</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.actions}>
          <div className={styles.actionRow}>
            <Button variant="outline" fullWidth style={{ flex: 1 }}>
              View Details
            </Button>
            <Button variant="primary" fullWidth style={{ flex: 1 }} onClick={onEnquire}>
              Enquire on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
