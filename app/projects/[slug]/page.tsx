import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { PageHomeHint } from '@/app/components/PageHomeHint';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import { Button } from '@/app/components/Button';
import { WHATSAPP_NUMBER } from '@/app/lib/contact';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import Category from '@/lib/models/Category';
import Media from '@/lib/models/Media';
import styles from './ProjectDetail.module.css';
import { Metadata } from 'next';
import { ProjectGallery } from './ProjectGallery';
import { LightboxProvider } from './LightboxProvider';
import { InteractiveHeroImage } from './InteractiveHeroImage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const project = await Project.findOne({ slug, active: true }).lean();
  
  if (!project) return { title: 'Project Not Found | VECTOR-X SOLUTIONS' };

  return {
    title: `${project.title} | VECTOR-X SOLUTIONS`,
    description: project.shortDescription || project.fullDescription?.substring(0, 160) || '',
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await connectToDatabase();
  Category.init();
  
  const project = await Project.findOne({ slug, active: true })
    .populate('categoryId')
    .populate('subcategoryId').populate({ path: 'mediaIds', select: 'url altText width height' })
    .lean();

  if (!project) {
    notFound();
  }

  const categoryName = project.categoryId?.name || '';
  const subcategoryName = project.subcategoryId?.name || '';
  
  const allImages: { url: string, altText: string }[] = [];
  const addedUrls = new Set<string>();

  if (project.mediaIds && project.mediaIds.length > 0) {
    project.mediaIds.forEach((m: any) => {
      if (!addedUrls.has(m.url)) {
        allImages.push({ url: m.url, altText: m.altText || project.title });
        addedUrls.add(m.url);
      }
    });
  }
  if (project.images && project.images.length > 0) {
    project.images.forEach((url: string) => {
      if (!addedUrls.has(url)) {
        allImages.push({ url, altText: project.title });
        addedUrls.add(url);
      }
    });
  }
  
  const whatsappMessage = `Hi VECTOR-X, I'm interested in a project similar to ${project.title}. Please share more details.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <Navbar />
      <PageHomeHint />
      <LightboxProvider images={allImages}>
      <main className={styles.main}>
        {/* HERO IMAGE */}
        <div className={styles.heroWrapper}>
          {(() => {
            if (allImages.length > 0) {
              return <InteractiveHeroImage url={allImages[0].url} alt={allImages[0].altText} />;
            }
            return <div className={styles.heroPlaceholder}></div>;
          })()}
          <div className={styles.heroOverlay}></div>
          <Container>
            <div className={styles.heroContent}>
              {categoryName && <span className={styles.categoryBadge}>{categoryName}</span>}
              {subcategoryName && <span className={styles.subcategoryBadge}>{subcategoryName}</span>}
              <h1 className={styles.title}>{project.title}</h1>
              {project.projectType && (
                <div className={styles.client}>Type: <span>{project.projectType}</span></div>
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
              
              {project.fullDescription && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>PROJECT OVERVIEW</h3>
                  <div className={styles.descriptionContent}>
                    {project.fullDescription}
                  </div>
                </div>
              )}
              
              {project.technologies && project.technologies.length > 0 && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>TECHNOLOGIES</h3>
                  <div className={styles.tagList}>
                    {project.technologies.map((tech: string, i: number) => (
                      <span key={i} className={styles.tag}>{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {project.hardware && project.hardware.length > 0 && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>HARDWARE</h3>
                  <ul className={styles.list}>
                    {project.hardware.map((hw: string, i: number) => (
                      <li key={i} className={styles.listItem}>{hw}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.software && project.software.length > 0 && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>SOFTWARE</h3>
                  <ul className={styles.list}>
                    {project.software.map((sw: string, i: number) => (
                      <li key={i} className={styles.listItem}>{sw}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>KEY FEATURES</h3>
                  <ul className={styles.list}>
                    {project.features.map((feature: string, i: number) => (
                      <li key={i} className={styles.listItem}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(() => {
                const galleryImages = allImages.slice(1).map(img => img.url);
                
                if (galleryImages.length > 0) {
                  return (
                    <div className={styles.gallerySection}>
                      <h3 className={styles.sectionTitle}>GALLERY</h3>
                      <ProjectGallery images={galleryImages} title={project.title} startIndex={1} />
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            
            <div className={styles.sidebarColumn}>
              <div className={styles.ctaBox}>
                <h3 className={styles.ctaTitle}>INTERESTED IN A SIMILAR PROJECT?</h3>
                <p className={styles.ctaDesc}>
                  Tell us what you want to build. From prototyping to full development, our team can help turn your idea into a working system.
                </p>
                <div className={styles.actions}>
                  <a href="/build-your-project" style={{ display: 'block', textDecoration: 'none' }}>
                    <Button variant="primary" size="lg" fullWidth style={{ pointerEvents: 'none' }}>
                      BUILD YOUR PROJECT
                    </Button>
                  </a>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', marginTop: '1rem' }}>
                    <Button variant="outline" size="lg" fullWidth style={{ pointerEvents: 'none' }}>
                      DISCUSS ON WHATSAPP
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      </LightboxProvider>
      <Footer />
    </>
  );
}


