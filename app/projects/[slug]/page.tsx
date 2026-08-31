import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import { Button } from '@/app/components/Button';
import { WHATSAPP_NUMBER } from '@/app/lib/contact';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import Category from '@/lib/models/Category';
import styles from './ProjectDetail.module.css';
import { Metadata } from 'next';
import { ProjectGallery } from './ProjectGallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const project = await Project.findOne({ slug, isActive: true }).lean();
  
  if (!project) return { title: 'Project Not Found | YOURSTORE' };

  return {
    title: `${project.title} | YOURSTORE`,
    description: project.shortDescription || project.description?.substring(0, 160) || '',
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await connectToDatabase();
  Category.init();
  
  const project = await Project.findOne({ slug, isActive: true })
    .lean();

  if (!project) {
    notFound();
  }

  const categoryName = project.category || 'Projects';
  
  const whatsappMessage = `Hi YOURSTORE, I'm interested in a project similar to ${project.title}. Please share more details.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* HERO IMAGE */}
        <div className={styles.heroWrapper}>
          {project.images && project.images.length > 0 ? (
            <img src={project.images[0]} alt={project.title} className={styles.heroImage} />
          ) : (
            <div className={styles.heroPlaceholder}></div>
          )}
          <div className={styles.heroOverlay}></div>
          <Container>
            <div className={styles.heroContent}>
              <span className={styles.categoryBadge}>{categoryName}</span>
              <h1 className={styles.title}>{project.title}</h1>
              {project.client && (
                <div className={styles.client}>Client: <span>{project.client}</span></div>
              )}
            </div>
          </Container>
        </div>

        <Container>
          <div className={styles.contentGrid}>
            <div className={styles.infoColumn}>
              {project.shortDescription && (
                <p className={styles.shortDescription}>{project.shortDescription}</p>
              )}
              
              {project.description && (
                <div className={styles.descriptionSection}>
                  <div className={styles.descriptionContent}>
                    {project.description}
                  </div>
                </div>
              )}

              {project.images && project.images.length > 1 && (
                <div className={styles.gallerySection}>
                  <h3 className={styles.sectionTitle}>Gallery</h3>
                  <ProjectGallery images={project.images.slice(1)} title={project.title} />
                </div>
              )}
            </div>
            
            <div className={styles.sidebarColumn}>
              <div className={styles.ctaBox}>
                <h3 className={styles.ctaTitle}>BUILD SOMETHING SIMILAR</h3>
                <p className={styles.ctaDesc}>
                  Interested in a custom UAV solution like this? Our team can design and build a system tailored to your requirements.
                </p>
                <div className={styles.actions}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                    <Button variant="primary" size="lg" fullWidth style={{ pointerEvents: 'none' }}>
                      START A SIMILAR PROJECT
                    </Button>
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', marginTop: '1rem' }}>
                    <Button variant="outline" size="lg" fullWidth style={{ pointerEvents: 'none' }}>
                      CHAT ON WHATSAPP
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
