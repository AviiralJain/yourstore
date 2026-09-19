"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Container } from './Container';
import styles from './Navbar.module.css';
import { WhatsAppButton } from './WhatsAppButton';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (path: string, isHash = false) => {
    if (isHash) return styles.link;
    if (path === '/' && pathname === '/') return `${styles.link} ${styles.active}`;
    if (path !== '/' && pathname?.startsWith(path)) return `${styles.link} ${styles.active}`;
    return styles.link;
  };

  return (
    <nav className={styles.navbar}>
      <Container className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/images/vector-x-logo-final.png" 
            alt="VECTOR-X SOLUTIONS" 
            width={180} 
            height={60} 
            priority 
          />
        </Link>
        
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Search projects, technologies..." 
            className={styles.searchInput} 
          />
          <button className={styles.searchBtn} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
          </button>
        </div>
        
        <div className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} onClick={() => setIsOpen(false)} />
        <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          <Link href="/portfolio" className={getLinkClass('/portfolio')} onClick={() => setIsOpen(false)}>Portfolio</Link>
          <Link href="/services" className={getLinkClass('/services')} onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/build-your-project" className={getLinkClass('/build-your-project')} onClick={() => setIsOpen(false)}>Build Your Project</Link>
          <Link href="/workshops" className={getLinkClass('/workshops')} onClick={() => setIsOpen(false)}>Workshops & Training</Link>
          <Link href="/#why-vector-x" className={getLinkClass('/#why-vector-x', true)} onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/#contact" className={getLinkClass('/#contact', true)} onClick={() => setIsOpen(false)}>Contact</Link>
          
          <div className={styles.mobileAction}>
            <ThemeToggle />
            <WhatsAppButton label="Enquire Now" />
          </div>
        </div>
        
        <div className={styles.actions}>
          <div className={styles.desktopAction}>
            <ThemeToggle />
            <WhatsAppButton label="WhatsApp" />
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


