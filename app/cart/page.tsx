"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Container } from '@/app/components/Container';
import { Button } from '@/app/components/Button';
import { useCart } from '@/app/context/CartContext';
import { WHATSAPP_NUMBER } from '@/app/lib/contact';
import styles from './cart.module.css';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <Container>
            <h1 className={styles.title}>Enquiry Cart</h1>
            <p>Loading...</p>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const handleEnquire = () => {
    if (items.length === 0) return;

    const messageLines = [
      "Hi YOURSTORE,",
      "",
      "I'm interested in the following products:",
      ""
    ];

    items.forEach((item, index) => {
      let line = `${index + 1}. ${item.name} (Qty: ${item.quantity})`;
      if (item.stockStatus === 'OUT_OF_STOCK') {
        line += ' - OUT OF STOCK';
      }
      messageLines.push(line);
    });

    messageLines.push("");
    messageLines.push("Please share availability, pricing and details.");
    messageLines.push("Thank you.");

    const fullMessage = messageLines.join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const estimatedTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = getCartCount();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Container>
          <div className={styles.cartHeader}>
            <h1 className={styles.title}>Enquiry Cart</h1>
            {cartCount > 0 && <span className={styles.itemCount}>{cartCount} Item{cartCount !== 1 && 's'}</span>}
          </div>

          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🛒</div>
              <h2>Your enquiry cart is empty</h2>
              <p>Browse our catalog and add products you'd like to enquire about.</p>
              <Link href="/#products" style={{ textDecoration: 'none' }}>
                <Button variant="primary">CONTINUE SHOPPING</Button>
              </Link>
            </div>
          ) : (
            <div className={styles.cartGrid}>
              <div className={styles.cartItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImageContainer}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                      ) : (
                        <div className={styles.itemImagePlaceholder}></div>
                      )}
                    </div>
                    
                    <div className={styles.itemDetails}>
                      <Link href={`/products/${item.slug}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      
                      <div className={styles.itemMeta}>
                        <div className={styles.itemPrice}>₹{item.price}</div>
                        {item.stockStatus === 'OUT_OF_STOCK' && (
                          <div className={styles.outOfStockBadge}>OUT OF STOCK</div>
                        )}
                      </div>
                      
                      <div className={styles.itemActions}>
                        <div className={styles.quantityControl}>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          className={styles.removeBtn}
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className={styles.cartActionsContainer}>
                  <button onClick={clearCart} className={styles.clearBtn}>
                    Clear Cart
                  </button>
                  <Link href="/#products" className={styles.continueLink}>
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              <div className={styles.cartSummary}>
                <div className={styles.summaryBox}>
                  <h3 className={styles.summaryTitle}>Enquiry Summary</h3>
                  
                  <div className={styles.summaryRow}>
                    <span>Total Items</span>
                    <span>{cartCount}</span>
                  </div>
                  
                  <div className={styles.summaryTotal}>
                    <span>Estimated product total</span>
                    <span className={styles.totalPrice}>₹{estimatedTotal}</span>
                  </div>
                  <p className={styles.disclaimer}>
                    This is an estimated total. Final pricing, availability, and shipping will be confirmed via WhatsApp.
                  </p>
                  
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    onClick={handleEnquire}
                  >
                    ENQUIRE ALL ON WHATSAPP
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
