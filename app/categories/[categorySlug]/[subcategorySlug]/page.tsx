import React from 'react';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Product from '@/lib/models/Product';
import { Container } from '@/app/components/Container';
import { ProductCard } from '@/app/components/ProductCard';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string, subcategorySlug: string }> }) {
  const { categorySlug, subcategorySlug } = await params;
  await connectToDatabase();
  const category = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
  if (!category) return { title: 'Not Found - YOURSTORE' };

  const subcategory = await Subcategory.findOne({ slug: subcategorySlug, categoryId: category._id, isActive: true }).lean();
  if (!subcategory) return { title: 'Not Found - YOURSTORE' };

  return {
    title: `${subcategory.name} - ${category.name} - YOURSTORE`,
    description: subcategory.description || `Browse ${subcategory.name} products at YOURSTORE.`,
  };
}

export default async function SubcategoryPage({ params }: { params: Promise<{ categorySlug: string, subcategorySlug: string }> }) {
  const { categorySlug, subcategorySlug } = await params;
  await connectToDatabase();

  const category = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
  if (!category) {
    notFound();
  }

  const subcategory = await Subcategory.findOne({ slug: subcategorySlug, categoryId: category._id, isActive: true }).lean();
  if (!subcategory) {
    notFound();
  }

  const products = await Product.find({ subcategoryId: subcategory._id, isActive: true }).sort({ createdAt: -1 }).lean();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Container>
        <div style={{ padding: 'var(--spacing-2xl) 0' }}>
          <div style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Home</Link> 
            {' / '}
            <Link href={`/categories/${category.slug}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{category.name}</Link>
            {' / '}
            <span style={{ color: 'var(--text-main)' }}>{subcategory.name}</span>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-main)' }}>
            {subcategory.name}
          </h1>
          {subcategory.description && (
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px', marginBottom: 'var(--spacing-2xl)' }}>
              {subcategory.description}
            </p>
          )}

          <div style={{ marginTop: 'var(--spacing-2xl)' }}>
            {products.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)'
              }}>
                {products.map(product => (
                  <ProductCard
                    key={product._id.toString()}
                    title={product.name}
                    category={subcategory.name}
                    price={product.price ? `₹${product.price}` : ''}
                    specs={product.specifications?.slice(0, 3).map((s: any) => ({ label: s.key, value: s.value })) || []}
                    image={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    slug={product.slug}
                    stockStatus={product.stockStatus}
                    stockQuantity={product.stockQuantity}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-muted)' }}>No products found in this subcategory yet.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
