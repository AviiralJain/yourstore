import React from 'react';
import { Container } from './Container';
import styles from './Footer.module.css';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="contact">
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoHighlight}>YOUR</span>STORE
            </Link>
            <p className={styles.description}>
              Quality drone components and custom UAV solutions for builders, engineers, students and businesses.
            </p>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Products</h4>
            <Link href="#" className={styles.link}>Motors</Link>
            <Link href="#" className={styles.link}>ESCs</Link>
            <Link href="#" className={styles.link}>Flight Controllers</Link>
            <Link href="#" className={styles.link}>Propellers</Link>
            <Link href="#" className={styles.link}>Sensors</Link>
            <Link href="#" className={styles.link}>Frames</Link>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Projects</h4>
            <Link href="#" className={styles.link}>Ready Projects</Link>
            <Link href="#" className={styles.link}>Custom Projects</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <Link href="#about" className={styles.link}>About</Link>
            <Link href="#contact" className={styles.link}>Contact</Link>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <p className={styles.text}>WhatsApp: [Add number]</p>
            <p className={styles.text}>Email: [Add business email]</p>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} YOURSTORE. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
