"use client";

import React, { useState, useEffect } from 'react';
import styles from './ProductCard.module.css';
import { Button } from './Button';
import { WHATSAPP_NUMBER } from '../lib/contact';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id?: string;
  title: string;
  category: string;
  price: string;
  specs: { label: string; value: string }[];
  image?: string;
  mainCategory?: string;
  subCategory?: string;
  slug?: string;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  stockQuantity?: number;
  onEnquire?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  category,
  price,
  specs,
  image,
  mainCategory,
  subCategory,
  slug,
  stockStatus = 'IN_STOCK',
  stockQuantity,
  onEnquire
}) => {
  const { addToCart, isInCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const message = `Hi YOURSTORE, I'm interested in ${title}. Please share availability and pricing.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  // Using a fallback ID if id is not passed, but in new data it should be
  const productId = id || slug || title; 
  const numPrice = parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
  
  const inCart = mounted && isInCart(productId);

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      slug: slug || '',
      name: title,
      price: numPrice,
      image: image || '',
      stockStatus: stockStatus
    });
  };

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
        
        <div style={{ margin: '0.5rem 0', fontSize: '0.8rem', fontWeight: 600 }}>
          {stockStatus === 'IN_STOCK' && <span style={{ color: '#4CAF50' }}>🟢 IN STOCK</span>}
          {stockStatus === 'LOW_STOCK' && (
            <span style={{ color: '#FF9800' }}>
              🟠 LOW STOCK {stockQuantity !== undefined && stockQuantity !== null && `(Only ${stockQuantity} left)`}
            </span>
          )}
          {stockStatus === 'OUT_OF_STOCK' && <span style={{ color: '#F44336' }}>🔴 OUT OF STOCK</span>}
        </div>
        
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
          <div className={styles.actionRow} style={{ marginBottom: '8px' }}>
            {slug ? (
              <a href={`/products/${slug}`} style={{ flex: 1, display: 'block', textDecoration: 'none' }}>
                <Button variant="outline" fullWidth style={{ pointerEvents: 'none' }}>
                  View Details
                </Button>
              </a>
            ) : (
              <Button variant="outline" fullWidth style={{ flex: 1 }}>
                View Details
              </Button>
            )}
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: 'block' }}>
              <Button variant="outline" fullWidth style={{ pointerEvents: 'none' }}>
                WhatsApp
              </Button>
            </a>
          </div>
          
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleAddToCart}
            disabled={inCart}
          >
            {inCart ? 'IN ENQUIRY CART' : 'ADD TO ENQUIRY CART'}
          </Button>
        </div>
      </div>
    </div>
  );
};
