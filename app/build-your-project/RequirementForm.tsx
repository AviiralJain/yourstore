'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/Button';
import styles from './BuildYourProject.module.css';
import { WHATSAPP_NUMBER } from '@/app/lib/contact';

const DEFAULT_OPTIONS = {
  user_type: [
    { label: 'School Student', value: 'School Student' },
    { label: 'Diploma Student', value: 'Diploma Student' },
    { label: 'Engineering Student', value: 'Engineering Student' },
    { label: 'College / University Team', value: 'College / University Team' },
    { label: 'Researcher', value: 'Researcher' },
    { label: 'Student Innovator', value: 'Student Innovator' },
    { label: 'Startup', value: 'Startup' },
    { label: 'Organization / Industry', value: 'Organization / Industry' },
    { label: 'Other', value: 'Other' }
  ],
  project_domain: [
    { label: 'Drone & UAV Technology', value: 'Drone & UAV Technology' },
    { label: 'Robotics & Automation', value: 'Robotics & Automation' },
    { label: 'Embedded Systems & Electronics', value: 'Embedded Systems & Electronics' },
    { label: 'IoT & Smart Systems', value: 'IoT & Smart Systems' },
    { label: 'AI & Computer Vision', value: 'AI & Computer Vision' },
    { label: 'Autonomous Technologies', value: 'Autonomous Technologies' },
    { label: 'R&D & Prototyping', value: 'R&D & Prototyping' },
    { label: 'Other', value: 'Other' }
  ],
  current_stage: [
    { label: 'Idea / Concept', value: 'Idea / Concept' },
    { label: 'Planning', value: 'Planning' },
    { label: 'Design', value: 'Design' },
    { label: 'Development', value: 'Development' },
    { label: 'Prototype', value: 'Prototype' },
    { label: 'Testing', value: 'Testing' },
    { label: 'Existing Project - Need Improvements', value: 'Existing Project - Need Improvements' }
  ],
  timeline: [
    { label: 'No fixed deadline', value: 'No fixed deadline' },
    { label: 'Within 1 month', value: 'Within 1 month' },
    { label: '1-3 months', value: '1-3 months' },
    { label: '3-6 months', value: '3-6 months' },
    { label: 'More than 6 months', value: 'More than 6 months' }
  ],
  preferred_contact_method: [
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Phone Call', value: 'Phone Call' },
    { label: 'Email', value: 'Email' }
  ]
};

export const RequirementForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [dynamicOptions, setDynamicOptions] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '',
    projectDomain: '',
    projectTitle: '',
    description: '',
    currentStage: '',
    technologies: '',
    requirements: '',
    timeline: '',
    additionalInformation: '',
    preferredContactMethod: ''
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/form-options');
        if (res.ok) {
          const data = await res.json();
          setDynamicOptions(data);
        }
      } catch (err) {
        console.error('Failed to load dynamic options', err);
      }
    };
    fetchOptions();
  }, []);

  const getOptions = (group: keyof typeof DEFAULT_OPTIONS) => {
    if (dynamicOptions && dynamicOptions[group] && dynamicOptions[group].length > 0) {
      return dynamicOptions[group];
    }
    return DEFAULT_OPTIONS[group];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/project-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while submitting your requirement. Please try again.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const whatsappMsg = encodeURIComponent('Hello, I just submitted a project requirement via the website. My name is ' + formData.name + '.');

    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>REQUIREMENT SUBMITTED</h2>
        <p className={styles.successMessage}>
          Thank you for sharing your project idea with us. Our technical team will review your requirements and get back to you shortly to discuss the next steps.
        </p>
        
        <div className={styles.successActions}>
          <Link href={'/'} className={styles.outlineBtn}>
            RETURN HOME
          </Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`} target={'_blank'} rel={'noopener noreferrer'} className={styles.whatsappBtn}>
            CHAT ON WHATSAPP
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.formGroup}>
        <h3 className={styles.groupTitle}>ABOUT YOU</h3>
        
        <div className={styles.inputRow}>
          <div className={styles.inputField}>
            <label htmlFor={'name'}>Full Name *</label>
            <input type={'text'} id={'name'} name={'name'} required value={formData.name} onChange={handleChange} />
          </div>
          <div className={styles.inputField}>
            <label htmlFor={'email'}>Email Address *</label>
            <input type={'email'} id={'email'} name={'email'} required value={formData.email} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputField}>
            <label htmlFor={'phone'}>Phone / WhatsApp Number *</label>
            <input type={'text'} id={'phone'} name={'phone'} required value={formData.phone} onChange={handleChange} />
          </div>
          <div className={styles.inputField}>
            <label htmlFor={'userType'}>Who are you? *</label>
            <select id={'userType'} name={'userType'} required value={formData.userType} onChange={handleChange}>
              <option value={''}>Select an option...</option>
              {getOptions('user_type').map((opt: any, i: number) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <h3 className={styles.groupTitle}>YOUR PROJECT</h3>
        
        <div className={styles.inputRow}>
          <div className={styles.inputField}>
            <label htmlFor={'projectDomain'}>Project Type / Domain *</label>
            <select id={'projectDomain'} name={'projectDomain'} required value={formData.projectDomain} onChange={handleChange}>
              <option value={''}>Select a domain...</option>
              {getOptions('project_domain').map((opt: any, i: number) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputField}>
            <label htmlFor={'currentStage'}>Current Stage</label>
            <select id={'currentStage'} name={'currentStage'} value={formData.currentStage} onChange={handleChange}>
              <option value={''}>Select current stage...</option>
              {getOptions('current_stage').map((opt: any, i: number) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.inputField}>
          <label htmlFor={'projectTitle'}>Project Title</label>
          <input type={'text'} id={'projectTitle'} name={'projectTitle'} placeholder={'e.g. Autonomous Line Following Robot'} value={formData.projectTitle} onChange={handleChange} />
        </div>

        <div className={styles.inputField}>
          <label htmlFor={'description'}>Tell us about your idea *</label>
          <textarea id={'description'} name={'description'} required placeholder={'Describe what you want to build, what it should do, or the problem you want to solve...'} value={formData.description} onChange={handleChange} rows={5}></textarea>
        </div>
      </div>

      <div className={styles.formGroup}>
        <h3 className={styles.groupTitle}>TECHNICAL REQUIREMENTS</h3>
        
        <div className={styles.inputField}>
          <label htmlFor={'technologies'}>Preferred technologies or hardware</label>
          <input type={'text'} id={'technologies'} name={'technologies'} placeholder={'e.g. ESP32, Arduino, Raspberry Pi, STM32, sensors, camera, drone flight controller...'} value={formData.technologies} onChange={handleChange} />
        </div>

        <div className={styles.inputField}>
          <label htmlFor={'requirements'}>Key requirements or features</label>
          <textarea id={'requirements'} name={'requirements'} placeholder={'List important features, constraints, integrations, or expected outcomes...'} value={formData.requirements} onChange={handleChange} rows={3}></textarea>
        </div>
      </div>

      <div className={styles.formGroup}>
        <h3 className={styles.groupTitle}>PROJECT CONTEXT</h3>
        
        <div className={styles.inputRow}>
          <div className={styles.inputField}>
            <label htmlFor={'timeline'}>Project Timeline</label>
            <select id={'timeline'} name={'timeline'} value={formData.timeline} onChange={handleChange}>
              <option value={''}>Select timeline...</option>
              {getOptions('timeline').map((opt: any, i: number) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputField}>
            <label htmlFor={'preferredContactMethod'}>Preferred Contact Method</label>
            <select id={'preferredContactMethod'} name={'preferredContactMethod'} value={formData.preferredContactMethod} onChange={handleChange}>
              <option value={''}>Select method...</option>
              {getOptions('preferred_contact_method').map((opt: any, i: number) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.inputField}>
          <label htmlFor={'additionalInformation'}>Anything else we should know?</label>
          <textarea id={'additionalInformation'} name={'additionalInformation'} value={formData.additionalInformation} onChange={handleChange} rows={2}></textarea>
        </div>
      </div>

      <button type={'submit'} className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT PROJECT REQUIREMENT'}
      </button>

      <p className={styles.disclaimer}>
        Submitting this form sends your project requirement to VECTOR-X Solutions. Our team can review the requirement and discuss the next steps with you.
      </p>
    </form>
  );
};
