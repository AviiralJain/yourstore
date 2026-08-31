"use client";

import React, { useState, useEffect } from 'react';
import { ProductCarousel } from './ProductCarousel';
import { ProductCard } from './ProductCard';

export const FeaturedProductsCarousel: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch featured products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading featured products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Products are currently being updated.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-color)', borderRadius: '8px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No featured products available yet.</p>
      </div>
    );
  }

  return (
    <ProductCarousel>
      {products.map(product => (
        <ProductCard 
          key={product.id}
          title={product.name}
          category={product.subcategoryName ? `${product.categoryName} - ${product.subcategoryName}` : product.categoryName}
          mainCategory={product.categoryName}
          subCategory={product.subcategoryName || ''}
          slug={product.slug}
          price={`₹${product.price}`}
          image={product.images && product.images.length > 0 ? product.images[0] : ''}
          specs={product.specifications || []}
        />
      ))}
    </ProductCarousel>
  );
};
