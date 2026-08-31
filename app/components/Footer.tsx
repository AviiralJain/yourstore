import React from 'react';
import { Container } from './Container';
import styles from './Footer.module.css';
import Link from 'next/link';
import { PHONE_DISPLAY, EMAIL, WHATSAPP_NUMBER } from '../lib/contact';

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
            <Link href="/#products" className={styles.link}>Featured Components</Link>
            <Link href="/#categories" className={styles.link}>Shop by Category</Link>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Projects</h4>
            <Link href="/#projects" className={styles.link}>Our Projects</Link>
            <Link href="/build-your-project" className={styles.link}>Custom Projects</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Company</h4>
            <Link href="#about" className={styles.link}>About</Link>
            <Link href="#contact" className={styles.link}>Contact</Link>
          </div>
          
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <p className={styles.text}>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">WhatsApp: Chat with us</a>
            </p>
            <p className={styles.text}>
              <a href={`tel:${PHONE_DISPLAY.replace(/\s+/g, '')}`}>Phone: {PHONE_DISPLAY}</a>
            </p>
            <p className={styles.text}>
              <a href={`mailto:${EMAIL}`}>Email: {EMAIL}</a>
            </p>
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
