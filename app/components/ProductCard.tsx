import React from 'react';
import styles from './ProductCard.module.css';
import { Button } from './Button';
import { WHATSAPP_NUMBER } from '../lib/contact';

interface ProductCardProps {
  title: string;
  category: string;
  price: string;
  specs: { label: string; value: string }[];
  image?: string;
  mainCategory?: string;
  subCategory?: string;
  onEnquire?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  category,
  price,
  specs,
  image,
  mainCategory,
  subCategory,
  onEnquire
}) => {
  const message = `Hi YOURSTORE, I'm interested in ${title}. Please share availability and pricing.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

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
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block' }}>
              <Button variant="primary" fullWidth style={{ pointerEvents: 'none' }}>
                Enquire on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
