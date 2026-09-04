"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../lib/contact';
import { StockNotificationForm } from './StockNotificationForm';

interface ProductActionsProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    stockStatus: string;
  };
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappMessage = `Hi YOURSTORE, I'm interested in ${product.name}. Please share availability and pricing.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
  
  const inCart = mounted && isInCart(product._id);
  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      stockStatus: product.stockStatus
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem' }}>
      <Button 
        variant="primary" 
        size="lg" 
        fullWidth 
        onClick={handleAddToCart}
        disabled={inCart}
      >
        {inCart ? 'IN ENQUIRY CART' : 'ADD TO ENQUIRY CART'}
      </Button>

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
        <Button variant="outline" size="lg" fullWidth style={{ pointerEvents: 'none' }}>
          ENQUIRE ON WHATSAPP
        </Button>
      </a>

      {isOutOfStock && (
        <div style={{ marginTop: '1rem' }}>
          <StockNotificationForm productId={product._id} productName={product.name} />
        </div>
      )}
    </div>
  );
};
