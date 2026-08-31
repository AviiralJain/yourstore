import React from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import { RequirementForm } from './RequirementForm';
import { Metadata } from 'next';
import styles from './BuildYourProject.module.css';

export const metadata: Metadata = {
  title: 'Build Your Project | YOURSTORE',
  description: 'Submit requirements for custom drone and robotics projects.',
};

export const dynamic = 'force-dynamic';

export default async function BuildYourProjectPage() {
  await connectToDatabase();
  
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  
  const formattedCategories = categories.map((c: any) => ({
    id: c._id.toString(),
    name: c.name
  }));

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.heroWrapper}>
          <div className={styles.heroOverlay}></div>
          <Container>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>CUSTOM PROJECT REQUIREMENTS</h1>
              <p className={styles.heroDesc}>
                Tell us what you want to build. From custom UAVs to robotics solutions, our team can help design and build a system tailored to your specific application.
              </p>
            </div>
          </Container>
        </div>
        
        <Container>
          <div className={styles.formContainer}>
            <RequirementForm categories={formattedCategories} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
