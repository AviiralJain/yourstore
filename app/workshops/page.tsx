import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/app/components/Navbar';
import { PageHomeHint } from '@/app/components/PageHomeHint';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import { Button } from '@/app/components/Button';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Workshops & Training | VECTOR-X Solutions',
  description: 'Hands-on technical workshops and customized training designed around specific technologies, projects, and learning requirements.',
};

export default function WorkshopsPage() {
  return (
    <>
      <Navbar />
      <PageHomeHint />
      <main className={styles.main}>
        
        {/* SECTION 01 — INTRO */}
        <section className={styles.introSection}>
          <Container>
            <div className={styles.introContent}>
              <span className={styles.eyebrow}>WORKSHOPS & TRAINING</span>
              <h1 className={styles.title}>PRACTICAL TRAINING. REAL ENGINEERING.</h1>
              <p className={styles.description}>
                Hands-on technical workshops and customized training designed around specific technologies, projects, and learning requirements.
              </p>
              <div className={styles.actions}>
                <Link href="/build-your-project" style={{ textDecoration: 'none' }}>
                  <Button variant="primary">DISCUSS TRAINING</Button>
                </Link>
                <Link href="/#contact" style={{ textDecoration: 'none' }}>
                  <Button variant="outline">CONTACT US</Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 02 — TRAINING APPROACH */}
        <section className={styles.sectionAlt}>
          <Container>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>TRAINING BUILT AROUND YOUR REQUIREMENT</h2>
              <p className={styles.sectionSubtitle}>
                VECTOR-X provides practical, project-oriented training where the content, depth, and hands-on work can be adapted to the participant's technical level and objective.
              </p>
            </div>
            
            <div className={styles.processGrid}>
              <div className={styles.processCard}>
                <div className={styles.processNumber}>01</div>
                <h3 className={styles.processTitle}>UNDERSTAND</h3>
                <p className={styles.processText}>Build a clear understanding of the concepts and system.</p>
              </div>
              <div className={styles.processCard}>
                <div className={styles.processNumber}>02</div>
                <h3 className={styles.processTitle}>BUILD</h3>
                <p className={styles.processText}>Work through practical implementation and hands-on development.</p>
              </div>
              <div className={styles.processCard}>
                <div className={styles.processNumber}>03</div>
                <h3 className={styles.processTitle}>APPLY</h3>
                <p className={styles.processText}>Use the knowledge to develop, test, and improve a real solution.</p>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 03 — CUSTOM TRAINING */}
        <section className={styles.section}>
          <Container>
            <div className={styles.customContent}>
              <h2 className={styles.sectionTitle}>LOOKING FOR A SPECIFIC WORKSHOP?</h2>
              <p className={styles.sectionSubtitle} style={{ marginBottom: 'var(--spacing-xl)' }}>
                Tell us the technology, project, or skill you want to work with. We can discuss a customized training approach around your requirement.
              </p>
              <Link href="/build-your-project" style={{ textDecoration: 'none' }}>
                <Button variant="primary">DISCUSS TRAINING</Button>
              </Link>
            </div>
          </Container>
        </section>

      </main>
      
      <Footer />
    </>
  );
}
