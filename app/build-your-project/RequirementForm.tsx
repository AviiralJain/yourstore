"use client";

import React, { useState } from 'react';
import styles from './BuildYourProject.module.css';
import { Button } from '@/app/components/Button';
import { WHATSAPP_NUMBER } from '@/app/lib/contact';

export const RequirementForm: React.FC<{ categories: { id: string; name: string }[] }> = ({ categories }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit requirement');
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while submitting your requirement. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = "Hi YOURSTORE, I just submitted a project requirement through the website. I'd like to discuss my project.";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  if (success) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>PROJECT REQUIREMENT RECEIVED</h2>
        <p className={styles.successDesc}>
          Thank you for sharing your project requirements. Our team will review them and get in touch with you shortly.
        </p>
        <div className={styles.successActions}>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Button variant="primary">CHAT ON WHATSAPP</Button>
          </a>
          <a href="/" style={{ textDecoration: 'none' }}>
            <Button variant="outline">BACK TO HOME</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.errorBanner}>{error}</div>
      )}
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">Full Name *</label>
          <input type="text" id="name" name="name" required className={styles.input} minLength={2} maxLength={100} />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phone">Phone Number *</label>
          <input type="tel" id="phone" name="phone" required className={styles.input} minLength={10} maxLength={15} />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email *</label>
          <input type="email" id="email" name="email" required className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="category">Project Category *</label>
          <select id="category" name="category" required className={styles.select}>
            <option value="">[ Select Category ▼ ]</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label} htmlFor="projectType">Project Type / Requirement *</label>
          <select id="projectType" name="projectType" required className={styles.select}>
            <option value="">[ Select Type ▼ ]</option>
            <option value="Ready-made Project">Ready-made Project</option>
            <option value="Custom Drone">Custom Drone</option>
            <option value="Custom Robotics">Custom Robotics</option>
            <option value="College Project">College Project</option>
            <option value="Industrial Solution">Industrial Solution</option>
            <option value="Research / Prototype">Research / Prototype</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label} htmlFor="description">Project Description *</label>
          <textarea 
            id="description" 
            name="description" 
            required 
            className={styles.textarea} 
            rows={6}
            placeholder="Tell us what you want to build, required components, intended application, approximate size, features, etc."
            minLength={10}
            maxLength={2000}
          ></textarea>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="budget">Budget (Optional)</label>
          <input type="text" id="budget" name="budget" className={styles.input} placeholder="e.g. ₹50,000" />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="deadline">Expected Completion / Deadline (Optional)</label>
          <input type="text" id="deadline" name="deadline" className={styles.input} placeholder="e.g. 2 Months" />
        </div>
      </div>
      
      <div className={styles.submitSection}>
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? 'SUBMITTING...' : 'SUBMIT REQUIREMENT'}
        </Button>
      </div>
    </form>
  );
};
