"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import styles from './Navbar.module.css';
import { WhatsAppButton } from './WhatsAppButton';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = getCartCount();

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
        
        <div className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} onClick={() => setIsOpen(false)} />
        <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          <Link href="/#products" className={styles.link} onClick={() => setIsOpen(false)}>Products</Link>
          <Link href="/#projects" className={styles.link} onClick={() => setIsOpen(false)}>Projects</Link>
          <Link href="/build-your-project" className={styles.link} onClick={() => setIsOpen(false)}>Build Your Project</Link>
          <Link href="/#about" className={styles.link} onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/#contact" className={styles.link} onClick={() => setIsOpen(false)}>Contact</Link>
          
          <div className={styles.mobileAction}>
            <Link href="/cart" className={styles.cartLinkMobile} onClick={() => setIsOpen(false)}>
              🛒 Cart {mounted && cartCount > 0 ? `(${cartCount})` : ''}
            </Link>
            <ThemeToggle />
            <WhatsAppButton label="Enquire Now" />
          </div>
        </div>
        
        <div className={styles.actions}>
          <div className={styles.desktopAction}>
            <Link href="/cart" className={styles.cartLink} aria-label="Cart">
              <span className={styles.cartIcon}>🛒</span>
              {mounted && cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
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
