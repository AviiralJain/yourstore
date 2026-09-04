import React from 'react';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import { Container } from '@/app/components/Container';
import { ProductCard } from '@/app/components/ProductCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products - YOURSTORE',
  description: 'Browse our complete catalog of premium drone components and aerospace engineering solutions.',
};

export default async function ProductsPage() {
  await connectToDatabase();

  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  const categories = await Category.find({ isActive: true }).lean();
  
  Category.init();
  Subcategory.init();
  Product.init();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Container>
        <div style={{ padding: 'var(--spacing-2xl) 0' }}>
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>&larr; Back to Home</Link>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-main)' }}>
            All Products
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px', marginBottom: 'var(--spacing-2xl)' }}>
            Explore our complete catalog of high-performance UAV parts, electronics, and custom solutions.
          </p>

          {products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}>
              {products.map((product: any) => {
                const category = categories.find((c: any) => c._id.toString() === product.categoryId?.toString());
                return (
                  <ProductCard
                    key={product._id.toString()}
                    title={product.name}
                    category={category ? category.name : 'Uncategorized'}
                    price={product.price ? `₹${product.price}` : ''}
                    specs={product.specifications?.slice(0, 3).map((s: any) => ({ label: s.key, value: s.value })) || []}
                    image={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    slug={product.slug}
                    stockStatus={product.stockStatus}
                    stockQuantity={product.stockQuantity}
                  />
                );
              })}
            </div>
          ) : (
            <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No products available yet.</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
