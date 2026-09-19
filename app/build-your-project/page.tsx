import React from 'react';
import { Navbar } from '@/app/components/Navbar';
import { PageHomeHint } from '@/app/components/PageHomeHint';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import { Metadata } from 'next';
import styles from './BuildYourProject.module.css';
import { RequirementForm } from './RequirementForm';

export const metadata: Metadata = {
  title: 'Build Your Project | VECTOR-X Solutions',
  description: 'Tell VECTOR-X Solutions about your engineering project, prototype or technology idea across drones, robotics, embedded systems, IoT, AI and autonomous technologies.',
};

export default function BuildYourProjectPage() {
  return (
    <>
      <Navbar />
      <PageHomeHint />
      <main className={styles.main}>
        <Container>
          <div className={styles.pageLayout}>
            {/* LEFT SIDE: Intro & Process */}
            <div className={styles.introSection}>
              <div className={styles.heroBlock}>
                <span className={styles.eyebrow}>BUILD YOUR PROJECT</span>
                <h1 className={styles.title}>LET'S BUILD SOMETHING REAL.</h1>
                <p className={styles.description}>
                  Have an idea, project requirement or problem to solve? Tell us what you're working on and we'll help turn it into a practical engineering solution.
                </p>
                <p className={styles.subDescription}>
                  From student projects and prototypes to robotics, UAVs, embedded systems, IoT and AI-powered solutions.
                </p>
              </div>

              <div className={styles.processBlock}>
                <div className={styles.processStep}>
                  <div className={styles.processNumber}>01</div>
                  <div className={styles.processLabel}>IDEA</div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processNumber}>02</div>
                  <div className={styles.processLabel}>DISCUSS</div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processNumber}>03</div>
                  <div className={styles.processLabel}>DESIGN</div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processNumber}>04</div>
                  <div className={styles.processLabel}>DEVELOP</div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processNumber}>05</div>
                  <div className={styles.processLabel}>TEST</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className={styles.formSection}>
              <div className={styles.formHeader}>
                <h2>TELL US ABOUT YOUR PROJECT</h2>
                <p>Share as much detail as you can. If you're still at the idea stage, that's completely fine.</p>
              </div>
              <RequirementForm />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

