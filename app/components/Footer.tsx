import React from 'react';
import { Container } from './Container';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.gridOverlay}></div>
      <Container>
        <div className={styles.topSection}>
          
          {/* LEFT: BRAND COLUMN */}
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logoLink} aria-label="Go to homepage">
              <Image 
                src="/images/vector-x-logo-final.png" 
                alt="VECTOR-X SOLUTIONS Logo" 
                width={190} 
                height={63} 
                className={`${styles.logoImage} ${styles.logoDark}`}
              />
              <Image 
                src="/images/vector-x-logo-footer-light.png" 
                alt="VECTOR-X SOLUTIONS Logo" 
                width={190} 
                height={63} 
                className={`${styles.logoImage} ${styles.logoLight}`}
              />
            </Link>
            
            <h3 className={styles.tagline}>
              Engineering Ideas. Building the Future.
            </h3>
            
            <p className={styles.description}>
              Engineering projects, technology solutions, practical training, and customized development across emerging technologies.
            </p>

            <div className={styles.socialIcons}>
              <a href="https://linkedin.com/company/vectorx-solutions" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <div className={styles.iconWrapper}><LinkedinIcon /></div>
                <span>LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/vector_xsolutions/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <div className={styles.iconWrapper}><InstagramIcon /></div>
                <span>Instagram</span>
              </a>
            </div>

            <div className={styles.subtleWorkflow}>
              IDEAS &rarr; DESIGN &rarr; DEVELOPMENT &rarr; PROTOTYPE &rarr; TESTING
            </div>
          </div>
          
          {/* MIDDLE: NAVIGATION */}
          <div className={styles.navContainer}>
            <div className={styles.navColumn}>
              <h4 className={styles.columnTitle}>EXPLORE</h4>
              <nav className={styles.navLinks}>
                <Link href="/portfolio" className={styles.link}>Portfolio</Link>
                <Link href="/services" className={styles.link}>Services</Link>
                <Link href="/workshops" className={styles.link}>Workshops &amp; Training</Link>
                <Link href="/#why-vector-x" className={styles.link}>About</Link>
                <Link href="/#contact" className={styles.link}>Contact</Link>
              </nav>
            </div>
            
            <div className={styles.navColumn}>
              <h4 className={styles.columnTitle}>BUILD</h4>
              <nav className={styles.navLinks}>
                <Link href="/build-your-project" className={styles.link}>Build Your Project</Link>
                <Link href="/build-your-project" className={styles.link}>Custom Solutions</Link>
              </nav>
            </div>
          </div>

          {/* RIGHT: CONNECT */}
          <div className={styles.connectColumn}>
            <h4 className={styles.columnTitle}>CONNECT</h4>
            
            <div className={styles.contactGroup}>
              <span className={styles.contactLabel}>EMAIL</span>
              <a href="mailto:vectorxsolutions@gmail.com" className={styles.contactValue}>
                vectorxsolutions@gmail.com
              </a>
            </div>

            <div className={styles.contactGroup}>
              <span className={styles.contactLabel}>PHONE</span>
              <a href="tel:9639003817" className={styles.contactValue}>9639003817</a>
              <a href="tel:9647562366" className={styles.contactValue}>9647562366</a>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} VECTOR-X Solutions. All rights reserved.
          </p>
          <p className={styles.bottomTagline}>
            ENGINEERING IDEAS. BUILDING THE FUTURE.
          </p>
        </div>
      </Container>
    </footer>
  );
};
