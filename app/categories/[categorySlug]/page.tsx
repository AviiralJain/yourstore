import React from 'react';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';
import { Container } from '@/app/components/Container';
import { ProductCard } from '@/app/components/ProductCard';
import styles from '@/app/products/[slug]/ProductDetail.module.css'; // Reusing some container styles
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  await connectToDatabase();
  const category = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
  
  if (!category) {
    return { title: 'Category Not Found - YOURSTORE' };
  }

  return {
    title: `${category.name} - YOURSTORE`,
    description: category.description || `Browse ${category.name} products at YOURSTORE.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  await connectToDatabase();

  const category = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
  if (!category) {
    notFound();
  }

  const subcategories = await Subcategory.find({ categoryId: category._id, isActive: true }).sort({ name: 1 }).lean();
  const products = await Product.find({ categoryId: category._id, isActive: true }).sort({ createdAt: -1 }).lean();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Container>
        <div style={{ padding: 'var(--spacing-2xl) 0' }}>
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>&larr; Back to Home</Link>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-main)' }}>
            {category.name}
          </h1>
          {category.description && (
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px', marginBottom: 'var(--spacing-2xl)' }}>
              {category.description}
            </p>
          )}

          {subcategories.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>Subcategories</h2>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                {subcategories.map(sub => (
                  <Link 
                    key={sub._id.toString()} 
                    href={`/categories/${category.slug}/${sub.slug}`}
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-lg)',
                      backgroundColor: 'var(--surface-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>All {category.name} Products</h2>
          
          {products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--spacing-lg)'
            }}>
              {products.map(product => {
                const subCat = subcategories.find(s => s._id.toString() === product.subcategoryId?.toString());
                
                return (
                  <ProductCard
                    key={product._id.toString()}
                    title={product.name}
                    category={category.name}
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
              <p style={{ color: 'var(--text-muted)' }}>No products found in this category yet.</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
