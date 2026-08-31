import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import { Button } from '@/app/components/Button';
import { WHATSAPP_NUMBER } from '@/app/lib/contact';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import styles from './ProductDetail.module.css';
import { Metadata } from 'next';
import { ProductGallery } from './ProductGallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ slug, isActive: true }).lean();
  
  if (!product) return { title: 'Product Not Found | YOURSTORE' };

  return {
    title: `${product.name} | YOURSTORE`,
    description: product.shortDescription || product.description?.substring(0, 160) || '',
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await connectToDatabase();
  Category.init();
  Subcategory.init();
  
  const product = await Product.findOne({ slug, isActive: true })
    .populate('categoryId', 'name')
    .populate('subcategoryId', 'name')
    .lean();

  if (!product) {
    notFound();
  }

  const categoryName = product.categoryId ? (product.categoryId as any).name : 'Unknown';
  const subcategoryName = product.subcategoryId ? (product.subcategoryId as any).name : null;
  
  const whatsappMessage = `Hi YOURSTORE, I'm interested in ${product.name}. Please share availability and pricing.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Container>
          <div className={styles.breadcrumb}>
            <a href="/">Home</a> / <a href="/#categories">{categoryName}</a> {subcategoryName && <> / <span>{subcategoryName}</span></>} / <span>{product.name}</span>
          </div>
          
          <div className={styles.productGrid}>
            <div className={styles.galleryColumn}>
              <ProductGallery images={product.images || []} title={product.name} />
            </div>
            
            <div className={styles.infoColumn}>
              <div className={styles.header}>
                <span className={styles.categoryBadge}>{subcategoryName || categoryName}</span>
                <h1 className={styles.title}>{product.name}</h1>
                <div className={styles.price}>₹{product.price}</div>
              </div>
              
              {product.shortDescription && (
                <p className={styles.shortDescription}>{product.shortDescription}</p>
              )}
              
              <div className={styles.actions}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                  <Button variant="primary" size="lg" fullWidth style={{ pointerEvents: 'none' }}>
                    ENQUIRE ON WHATSAPP
                  </Button>
                </a>
                <a href="/#products" style={{ display: 'block', textDecoration: 'none', marginTop: '1rem' }}>
                  <Button variant="outline" size="lg" fullWidth style={{ pointerEvents: 'none' }}>
                    BACK TO PRODUCTS
                  </Button>
                </a>
              </div>
              
              {product.description && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>Description</h3>
                  <div className={styles.descriptionContent}>
                    {product.description}
                  </div>
                </div>
              )}
              
              {product.specifications && product.specifications.length > 0 && (
                <div className={styles.specsSection}>
                  <h3 className={styles.sectionTitle}>Specifications</h3>
                  <table className={styles.specsTable}>
                    <tbody>
                      {product.specifications.map((spec: any, idx: number) => (
                        <tr key={idx}>
                          <td className={styles.specLabel}>{spec.key}</td>
                          <td className={styles.specValue}>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
