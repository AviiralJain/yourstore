import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/app/components/Navbar';
import { PageHomeHint } from '@/app/components/PageHomeHint';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import '@/lib/models/Media';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import { PortfolioClient } from './PortfolioClient';
import styles from './portfolio.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio | VECTOR-X Solutions',
  description: 'Explore engineering projects developed across drones, robotics, embedded systems, IoT, AI, autonomous technologies and R&D.',
};

export default async function PortfolioPage() {
  let serializedProjects: any[] = [];
  let serializedCategories: any[] = [];
  let serializedSubcategories: any[] = [];

  try {
    await connectToDatabase();

    // Ensure models are registered (especially if zero documents exist, Mongoose can sometimes be finicky in Next.js dev if not fully initiated)
    Category.init().catch(() => {});
    Subcategory.init().catch(() => {});
    
    const projects = await Project.find({ active: true }).populate({ path: 'mediaIds', select: 'url altText' }).sort({ createdAt: -1 }).lean() || [];
    const categories = await Category.find({ isActive: true }).lean() || [];
    const subcategories = await Subcategory.find({ isActive: true }).lean() || [];

    serializedProjects = projects.map((p: any) => ({
      _id: p._id?.toString() || '',
      title: p.title || 'Untitled',
      slug: p.slug || '',
      projectType: p.projectType || '',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      images: p.images || [],
      media: p.mediaIds || [],
      categoryId: p.categoryId ? p.categoryId.toString() : null,
      subcategoryId: p.subcategoryId ? p.subcategoryId.toString() : null,
      technologies: p.technologies || []
    }));

    serializedCategories = categories.map((c: any) => ({
      _id: c._id?.toString() || '',
      name: c.name || '',
      slug: c.slug || ''
    }));

    serializedSubcategories = subcategories.map((s: any) => ({
      _id: s._id?.toString() || '',
      name: s.name || '',
      slug: s.slug || '',
      categoryId: s.categoryId ? s.categoryId.toString() : null
    }));
  } catch (error) {
    console.error("Portfolio Page DB Error:", error);
    // If DB fails, fallback to empty arrays so the client page still renders the empty state gracefully.
  }

  return (
    <>
      <Navbar />
      <PageHomeHint />
      
      <main>
        <section className={styles.heroSection}>
          <Container>
            <h1 className={styles.heroTitle}>PORTFOLIO</h1>
            <p className={styles.heroDesc}>
              Engineering ideas brought to life. Explore projects developed across drones, robotics, embedded systems, IoT, AI, autonomous technologies and R&D.
            </p>
          </Container>
        </section>

        <PortfolioClient 
          projects={serializedProjects} 
          categories={serializedCategories} 
          subcategories={serializedSubcategories} 
        />
      </main>

      <Footer />
    </>
  );
}

