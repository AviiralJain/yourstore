'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/Button';
import styles from './BuildYourProject.module.css';
import { WHATSAPP_NUMBER } from '@/app/lib/contact';

export const RequirementForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <div className={styles.successIcon}>
          <svg width={'32'} height={'32'} viewBox={'0 0 24 24'} fill={'none'} stroke={'currentColor'} strokeWidth={'2'} strokeLinecap={'round'} strokeLinejoin={'round'}><polyline points={'20 6 9 17 4 12'}></polyline></svg>
        </div>
        <h2>PROJECT REQUIREMENT RECEIVED</h2>
        <p>Thank you for sharing your project idea. Your requirement has been submitted to VECTOR-X Solutions.</p>
        
        <div className={styles.successActions}>
          <Link href={'/'} style={{ textDecoration: 'none' }}>
            <Button variant={'outline'}>Back to Home</Button>
          </Link>
          <Link href={'/portfolio'} style={{ textDecoration: 'none' }}>
            <Button variant={'primary'}>Explore Portfolio</Button>
          </Link>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Prefer WhatsApp?</p>
          <a href={'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + whatsappMsg} target={'_blank'} rel={'noopener noreferrer'} className={styles.whatsappLink}>
            <svg width={'20'} height={'20'} viewBox={'0 0 24 24'} fill={'currentColor'}><path d={'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z'}/></svg>
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
              <option value={'School Student'}>School Student</option>
              <option value={'Diploma Student'}>Diploma Student</option>
              <option value={'Engineering Student'}>Engineering Student</option>
              <option value={'College / University Team'}>College / University Team</option>
              <option value={'Researcher'}>Researcher</option>
              <option value={'Student Innovator'}>Student Innovator</option>
              <option value={'Startup'}>Startup</option>
              <option value={'Organization / Industry'}>Organization / Industry</option>
              <option value={'Other'}>Other</option>
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
              <option value={'Drone & UAV Technology'}>Drone & UAV Technology</option>
              <option value={'Robotics & Automation'}>Robotics & Automation</option>
              <option value={'Embedded Systems & Electronics'}>Embedded Systems & Electronics</option>
              <option value={'IoT & Smart Systems'}>IoT & Smart Systems</option>
              <option value={'AI & Computer Vision'}>AI & Computer Vision</option>
              <option value={'Autonomous Technologies'}>Autonomous Technologies</option>
              <option value={'R&D & Prototyping'}>R&D & Prototyping</option>
              <option value={'Other'}>Other</option>
            </select>
          </div>
          <div className={styles.inputField}>
            <label htmlFor={'currentStage'}>Current Stage</label>
            <select id={'currentStage'} name={'currentStage'} value={formData.currentStage} onChange={handleChange}>
              <option value={''}>Select current stage...</option>
              <option value={'Idea / Concept'}>Idea / Concept</option>
              <option value={'Planning'}>Planning</option>
              <option value={'Design'}>Design</option>
              <option value={'Development'}>Development</option>
              <option value={'Prototype'}>Prototype</option>
              <option value={'Testing'}>Testing</option>
              <option value={'Existing Project — Need Improvements'}>Existing Project — Need Improvements</option>
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
              <option value={'No fixed deadline'}>No fixed deadline</option>
              <option value={'Within 1 month'}>Within 1 month</option>
              <option value={'1–3 months'}>1–3 months</option>
              <option value={'3–6 months'}>3–6 months</option>
              <option value={'More than 6 months'}>More than 6 months</option>
            </select>
          </div>
          <div className={styles.inputField}>
            <label htmlFor={'preferredContactMethod'}>Preferred Contact Method</label>
            <select id={'preferredContactMethod'} name={'preferredContactMethod'} value={formData.preferredContactMethod} onChange={handleChange}>
              <option value={''}>Select method...</option>
              <option value={'WhatsApp'}>WhatsApp</option>
              <option value={'Phone Call'}>Phone Call</option>
              <option value={'Email'}>Email</option>
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

