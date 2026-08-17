"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import styles from './Navbar.module.css';
import { WhatsAppButton } from './WhatsAppButton';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Container className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoHighlight}>YOUR</span>STORE
        </Link>
        
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Search motors, ESCs, propellers..." 
            className={styles.searchInput} 
          />
          <button className={styles.searchBtn} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          </button>
        </div>
        
        <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          <Link href="#products" className={styles.link} onClick={() => setIsOpen(false)}>Products</Link>
          <Link href="#projects" className={styles.link} onClick={() => setIsOpen(false)}>Projects</Link>
          <Link href="#custom-projects" className={styles.link} onClick={() => setIsOpen(false)}>Build Your Project</Link>
          <Link href="#about" className={styles.link} onClick={() => setIsOpen(false)}>About</Link>
          <Link href="#contact" className={styles.link} onClick={() => setIsOpen(false)}>Contact</Link>
          
          <div className={styles.mobileAction}>
            <ThemeToggle />
            <WhatsAppButton phoneNumber="0000000000" label="Enquire Now" />
          </div>
        </div>
        
        <div className={styles.actions}>
          <div className={styles.desktopAction}>
            <ThemeToggle />
            <WhatsAppButton phoneNumber="0000000000" label="WhatsApp" />
          </div>
          
          <button 
            className={styles.hamburger} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburgerLine} ${isOpen ? styles.line1Open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isOpen ? styles.line2Open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isOpen ? styles.line3Open : ''}`}></span>
          </button>
        </div>
      </Container>
    </nav>
  );
};
