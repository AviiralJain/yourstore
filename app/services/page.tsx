import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/app/components/Navbar';
import { PageHomeHint } from '@/app/components/PageHomeHint';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services | VECTOR-X Solutions',
  description: 'Engineering capabilities across Drone & UAV Technology, Robotics & Automation, Embedded Systems & Electronics, IoT & Smart Systems, AI & Computer Vision, Autonomous Technologies, and R&D & Prototyping.',
};

const SERVICES = [
  { id: '01', title: 'Drone & UAV Technology' },
  { id: '02', title: 'Robotics & Automation' },
  { id: '03', title: 'Embedded Systems & Electronics' },
  { id: '04', title: 'IoT & Smart Systems' },
  { id: '05', title: 'AI & Computer Vision' },
  { id: '06', title: 'Autonomous Technologies' },
  { id: '07', title: 'R&D & Prototyping' }
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <PageHomeHint />
      <main className={styles.main}>
        <Container>
          <div className={styles.contentWrapper}>
            {/* HERO SECTION */}
            <section className={styles.hero}>
              <span className={styles.eyebrow}>SERVICES</span>
              <h1 className={styles.title}>ENGINEERING CAPABILITIES</h1>
              <p className={styles.description}>
                Technology and engineering capabilities across drones, robotics, embedded systems, IoT, AI, autonomy, and prototyping.
              </p>
            </section>

            {/* SERVICES LIST SECTION */}
            <section className={styles.servicesSection}>
              <div className={styles.servicesList}>
                {SERVICES.map((service) => (
                  <div key={service.id} className={styles.serviceRow}>
                    <div className={styles.serviceNumber}>{service.id}</div>
                    <div className={styles.serviceName}>{service.title}</div>
                    <div className={styles.serviceArrow}> </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
