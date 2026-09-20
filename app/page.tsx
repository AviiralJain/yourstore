import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Container } from './components/Container';
import { SectionHeading } from './components/SectionHeading';
import { Button } from './components/Button';
import { ProjectsSection } from './components/ProjectsSection';
import { AIChat } from './components/AIChat';
import styles from './page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "VECTOR-X Solutions | Engineering Ideas. Building the Future.",
  description: "VECTOR-X Solutions develops customized engineering projects across drones, robotics, embedded systems, IoT, AI, autonomous technologies and R&D prototyping.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* SECTION 1 — HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <Container>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <span className={styles.eyebrow}>ENGINEERING • INNOVATION • TECHNOLOGY</span>
                <h1 className={styles.heroTitle}>
                  TURN YOUR IDEAS INTO<br />
                  <span className={styles.heroHighlight}>REAL-WORLD TECHNOLOGY.</span>
                </h1>
                <p className={styles.heroDesc}>
                  From drones and robotics to embedded systems, IoT, AI and autonomous technologies, VECTOR-X Solutions develops customized engineering solutions built around real-world requirements.
                </p>
                
                <div className={styles.heroActions}>
                  <Link href="/build-your-project" style={{ textDecoration: 'none' }}>
                    <Button variant="primary" size="lg">BUILD YOUR PROJECT</Button>
                  </Link>
                  <Link href="/portfolio" style={{ textDecoration: 'none' }}>
                    <Button variant="outline" size="lg">EXPLORE OUR PORTFOLIO</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 2 — WHAT WE DO */}
        <section className={`${styles.section} ${styles.sectionDark}`} id="what-we-do">
          <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-2xl)', flexWrap: 'wrap', gap: '1rem' }}>
              <SectionHeading 
                title="WHAT WE DO" 
                subtitle="Engineering solutions across hardware, software, intelligence and autonomous systems."
              />
              <Link href="/services" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none', marginBottom: 'var(--spacing-md)' }}>
                EXPLORE SERVICES &rarr;
              </Link>
            </div>
            
            <div className={styles.grid4}>
              <div className={styles.capabilityCard}>
                <div className={styles.capabilityNumber}>01</div>
                <h3 className={styles.capabilityTitle}>DRONE & UAV TECHNOLOGY</h3>
                <p className={styles.capabilityDesc}>Customized unmanned aerial systems, payload integration, and flight controllers.</p>
              </div>
              <div className={styles.capabilityCard}>
                <div className={styles.capabilityNumber}>02</div>
                <h3 className={styles.capabilityTitle}>ROBOTICS & AUTOMATION</h3>
                <p className={styles.capabilityDesc}>Mechanical design, kinematics, and intelligent automation systems.</p>
              </div>
              <div className={styles.capabilityCard}>
                <div className={styles.capabilityNumber}>03</div>
                <h3 className={styles.capabilityTitle}>EMBEDDED SYSTEMS & ELECTRONICS</h3>
                <p className={styles.capabilityDesc}>Microcontrollers, PCB design, and custom hardware engineering.</p>
              </div>
              <div className={styles.capabilityCard}>
                <div className={styles.capabilityNumber}>04</div>
                <h3 className={styles.capabilityTitle}>IoT & SMART SYSTEMS</h3>
                <p className={styles.capabilityDesc}>Sensor networks, telemetry, and connected device ecosystems.</p>
              </div>
              <div className={styles.capabilityCard}>
                <div className={styles.capabilityNumber}>05</div>
                <h3 className={styles.capabilityTitle}>AI & COMPUTER VISION</h3>
                <p className={styles.capabilityDesc}>Object detection, machine learning, and visual intelligence integration.</p>
              </div>
              <div className={styles.capabilityCard}>
                <div className={styles.capabilityNumber}>06</div>
                <h3 className={styles.capabilityTitle}>AUTONOMOUS TECHNOLOGIES</h3>
                <p className={styles.capabilityDesc}>Self-navigating systems, obstacle avoidance, and path planning.</p>
              </div>
              <div className={styles.capabilityCard}>
                <div className={styles.capabilityNumber}>07</div>
                <h3 className={styles.capabilityTitle}>R&D & PROTOTYPING</h3>
                <p className={styles.capabilityDesc}>Rapid prototyping, testing, and proof-of-concept development.</p>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 3 — FEATURED PROJECTS */}
        <section className={styles.section} id="projects">
          <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-2xl)', flexWrap: 'wrap', gap: '1rem' }}>
              <SectionHeading 
                title="FEATURED PROJECTS" 
                subtitle="Explore engineering projects developed across robotics, drones, embedded systems, AI and autonomous technologies."
              />
              <Link href="/portfolio" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none', marginBottom: 'var(--spacing-md)' }}>
                VIEW ALL PROJECTS &rarr;
              </Link>
            </div>
            
            <ProjectsSection />
          </Container>
        </section>

        {/* SECTION 4 — HOW WE WORK */}
        <section className={`${styles.section} ${styles.sectionDark}`} id="workflow">
          <Container>
            <SectionHeading 
              title="FROM IDEA TO REAL-WORLD SOLUTION" 
              subtitle="How VECTOR-X turns a requirement into a working engineering solution."
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-lg)' }}>
              
              <div className={styles.workflowCard}>
                <div className={styles.workflowImageContainer}>
                  <Image src="/images/workflow/idea-final.jpg" alt="Engineering ideation, concept sketching and system planning" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.workflowImage} />
                </div>
                <div className={styles.workflowContent}>
                  <div className={styles.workflowCardNumber}>01</div>
                  <div className={styles.workflowCardTitle}>IDEA</div>
                  <div className={styles.workflowCardDesc}>Define the problem and engineering objective.</div>
                </div>
              </div>

              <div className={styles.workflowCard}>
                <div className={styles.workflowImageContainer}>
                  <Image src="/images/workflow/design.jpg" alt="CAD design work and engineering architecture" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.workflowImage} />
                </div>
                <div className={styles.workflowContent}>
                  <div className={styles.workflowCardNumber}>02</div>
                  <div className={styles.workflowCardTitle}>DESIGN</div>
                  <div className={styles.workflowCardDesc}>Design the system architecture and solution.</div>
                </div>
              </div>

              <div className={styles.workflowCard}>
                <div className={styles.workflowImageContainer}>
                  <Image src="/images/workflow/development.jpg" alt="Hands-on electronics and embedded hardware integration" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.workflowImage} />
                </div>
                <div className={styles.workflowContent}>
                  <div className={styles.workflowCardNumber}>03</div>
                  <div className={styles.workflowCardTitle}>DEVELOPMENT</div>
                  <div className={styles.workflowCardDesc}>Build and integrate hardware and software.</div>
                </div>
              </div>

              <div className={styles.workflowCard}>
                <div className={styles.workflowImageContainer}>
                  <Image src="/images/workflow/prototype-final.jpg" alt="Physical engineering prototype of a drone/robot" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.workflowImage} />
                </div>
                <div className={styles.workflowContent}>
                  <div className={styles.workflowCardNumber}>04</div>
                  <div className={styles.workflowCardTitle}>PROTOTYPE</div>
                  <div className={styles.workflowCardDesc}>Build a working physical prototype.</div>
                </div>
              </div>

              <div className={styles.workflowCard}>
                <div className={styles.workflowImageContainer}>
                  <Image src="/images/workflow/testing.jpg" alt="Engineering laboratory testing, validation and debugging" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.workflowImage} />
                </div>
                <div className={styles.workflowContent}>
                  <div className={styles.workflowCardNumber}>05</div>
                  <div className={styles.workflowCardTitle}>TESTING</div>
                  <div className={styles.workflowCardDesc}>Test, validate, and refine the solution.</div>
                </div>
              </div>
              
            </div>
          </Container>
        </section>

        {/* SECTION 5 — WHO WE HELP */}
        <section className={styles.section} id="who-we-help">
          <Container>
            <SectionHeading 
              title="WHO WE HELP" 
              subtitle="Engineering support for academic, research, and industry applications."
            />
            
            <div className={styles.audienceGrid}>
              <div className={styles.audienceCard}>
                <div className={styles.audienceLabel}>01</div>
                <h3 className={styles.audienceTitle}>STUDENTS, RESEARCHERS & INNOVATORS</h3>
                <p className={styles.audienceDesc}>
                  Project development, technical guidance, prototyping, and hands-on support for academic and innovation-driven work.
                </p>
                <ul className={styles.audienceList}>
                  <li><span className={styles.audienceListIcon}>•</span> Academic & Engineering Projects</li>
                  <li><span className={styles.audienceListIcon}>•</span> Research & Prototype Development</li>
                  <li><span className={styles.audienceListIcon}>•</span> Competitions & Innovation Projects</li>
                  <li><span className={styles.audienceListIcon}>•</span> Technical Guidance & Mentorship</li>
                </ul>
              </div>

              <div className={styles.audienceCard}>
                <div className={styles.audienceLabel}>02</div>
                <h3 className={styles.audienceTitle}>STARTUPS & ORGANIZATIONS</h3>
                <p className={styles.audienceDesc}>
                  Engineering development and prototyping support for new products, proof-of-concepts, and technology applications.
                </p>
                <ul className={styles.audienceList}>
                  <li><span className={styles.audienceListIcon}>•</span> Proof-of-Concept Development</li>
                  <li><span className={styles.audienceListIcon}>•</span> Customized Engineering Solutions</li>
                  <li><span className={styles.audienceListIcon}>•</span> Hardware + Software Integration</li>
                  <li><span className={styles.audienceListIcon}>•</span> R&D & Prototyping</li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 6 — WORKSHOPS & TRAINING */}
        <section className={`${styles.section} ${styles.sectionDark}`} id="workshops">
          <Container>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-2xl)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>WORKSHOPS & TRAINING</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.6 }}>
                Practical, project-based learning across robotics, UAVs, embedded systems, IoT, AI, and autonomous technologies.
              </p>
              <Link href="/workshops" style={{ textDecoration: 'none' }}>
                <Button variant="outline">EXPLORE WORKSHOPS</Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* SECTION 7 — WHY VECTOR-X */}
        <section className={styles.section} id="why-vector-x">
          <Container>
            <div className={styles.whyHeaderWrapper}>
              <h2 className={styles.whyTitle}>WHY VECTOR-X</h2>
              <p className={styles.whySubtitle}>ENGINEERING IDEAS. BUILT INTO REAL SOLUTIONS.</p>
              <p className={styles.whyDescription}>
                VECTOR-X Solutions is an engineering and technology venture focused on turning ideas, requirements, and challenges into practical working systems. We work across drones, robotics, embedded systems, IoT, AI, autonomous technologies, and rapid prototyping — combining hardware, software, and hands-on engineering to build solutions that work in the real world.
              </p>
            </div>
            
            <div className={styles.whyGrid}>
              <div className={styles.whyCard}>
                <div className={styles.whyCardNumber}>01</div>
                <div className={styles.whyCardTitle}>BUILT AROUND THE PROBLEM</div>
                <div className={styles.whyCardDesc}>We start by understanding the requirement, application, and intended outcome.</div>
              </div>

              <div className={styles.whyCard}>
                <div className={styles.whyCardNumber}>02</div>
                <div className={styles.whyCardTitle}>PRACTICAL BY DESIGN</div>
                <div className={styles.whyCardDesc}>Our approach focuses on systems that can be built, tested, demonstrated, and improved.</div>
              </div>

              <div className={styles.whyCard}>
                <div className={styles.whyCardNumber}>03</div>
                <div className={styles.whyCardTitle}>HARDWARE MEETS SOFTWARE</div>
                <div className={styles.whyCardDesc}>We bring the physical and digital sides of a project together rather than treating them separately.</div>
              </div>

              <div className={styles.whyCard}>
                <div className={styles.whyCardNumber}>04</div>
                <div className={styles.whyCardTitle}>LEARN WHILE BUILDING</div>
                <div className={styles.whyCardDesc}>For students and innovators, the goal is not only a finished project but an understanding of how it works.</div>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 8 — FINAL CTA */}
        <section className={`${styles.section} ${styles.sectionDark}`} id="contact">
          <Container>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>READY TO BUILD SOMETHING REAL?</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                Tell us what you're working on, what you want to build, or the problem you want to solve.
              </p>
              <Link href="/build-your-project" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg">BUILD YOUR PROJECT</Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>
      
      <AIChat />
      <Footer />
    </>
  );
}

