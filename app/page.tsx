import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Container } from './components/Container';
import { SectionHeading } from './components/SectionHeading';
import { Button } from './components/Button';
import { ProductCard } from './components/ProductCard';
import { CategoryStrip } from './components/CategoryStrip';
import { ProjectCard } from './components/ProjectCard';
import styles from './page.module.css';
import { WHATSAPP_NUMBER } from './lib/contact';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <Container>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <span className={styles.eyebrow}>BUILD. FLY. EXPLORE.</span>
                <h1 className={styles.heroTitle}>
                  PREMIUM DRONE<br />
                  <span className={styles.heroHighlight}>PARTS & COMPONENTS</span>
                </h1>
                <p className={styles.heroDesc}>
                  Quality drone components for builders, engineers, students and professionals.
                </p>
                
                <div className={styles.heroActions}>
                  <Button variant="primary" size="lg">EXPLORE PRODUCTS &rarr;</Button>
                  <Button variant="outline" size="lg">BUILD YOUR PROJECT</Button>
                </div>

                <div className={styles.trustRow}>
                  <div className={styles.trustItem}>Quality Components</div>
                  <div className={styles.trustItem}>Expert Support</div>
                  <div className={styles.trustItem}>Custom Solutions</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <CategoryStrip />

        {/* FEATURED PRODUCTS */}
        <section className={styles.section} id="products">
          <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-2xl)' }}>
              <SectionHeading 
                title="FEATURED PRODUCTS" 
                subtitle="Explore our top-rated drone components."
              />
              <a href="#all-products" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                View All Products &rarr;
              </a>
            </div>
            
            <div className={styles.grid4}>
              <ProductCard 
                title="T-Motor F2207 1750KV Brushless Motor"
                category="Motors & Propellers"
                price="₹1,599"
                image="/images/products/motor.jpg"
                specs={[
                  { label: 'KV', value: '1750' },
                  { label: 'Weight', value: '34g' }
                ]}
              />
              <ProductCard 
                title="Hobbywing 40A 4-in-1 ESC"
                category="ESCs"
                price="₹2,999"
                image="/images/products/esc.jpg"
                specs={[
                  { label: 'Current', value: '40A' },
                  { label: 'Input', value: '3-6S' }
                ]}
              />
              <ProductCard 
                title="Kakute F7 Flight Controller"
                category="Flight Controllers"
                price="₹5,499"
                image="/images/products/flight-controller.jpg"
                specs={[
                  { label: 'MCU', value: 'STM32F745' },
                  { label: 'Gyro', value: 'MPU6000' }
                ]}
              />
              <ProductCard 
                title="Gemfan 51466 Propellers"
                category="Motors & Propellers"
                price="₹299"
                image="/images/products/propeller.jpg"
                specs={[
                  { label: 'Size', value: '5.1 inch' },
                  { label: 'Pitch', value: '4.6' }
                ]}
              />
              <ProductCard 
                title="Mark 4 7 Inch Drone Frame"
                category="Frames"
                price="₹1,899"
                specs={[
                  { label: 'Material', value: 'Carbon Fiber' },
                  { label: 'Size', value: '7 inch' }
                ]}
              />
            </div>
          </Container>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className={`${styles.section} ${styles.sectionDark}`}>
          <Container>
            <SectionHeading 
              title="SHOP BY CATEGORY" 
              subtitle="Browse high-quality parts for your next build."
            />
            
            <div className={styles.grid3}>
              <a href="#motors" className={styles.categoryCardLarge}>
                <img src="/images/products/motor.jpg" className={styles.categoryCardImage} alt="Motors" />
                <h3>Motors & Propellers</h3>
                <p>High-efficiency thrust systems.</p>
              </a>
              <a href="#fcs" className={styles.categoryCardLarge}>
                <img src="/images/products/flight-controller.jpg" className={styles.categoryCardImage} alt="Flight Controllers" />
                <h3>Flight Controllers</h3>
                <p>Advanced stability and autonomy.</p>
              </a>
              <a href="#escs" className={styles.categoryCardLarge}>
                <img src="/images/products/esc.jpg" className={styles.categoryCardImage} alt="ESCs" />
                <h3>ESCs</h3>
                <p>Precision motor management.</p>
              </a>
              <a href="#frames" className={styles.categoryCardLarge}>
                <h3>Frames</h3>
                <p>Durable carbon fiber builds.</p>
              </a>
              <a href="#sensors" className={styles.categoryCardLarge}>
                <h3>Sensors</h3>
                <p>GPS, LiDAR and optical flow.</p>
              </a>
              <a href="#fpv" className={styles.categoryCardLarge}>
                <h3>FPV & Communication</h3>
                <p>VTX, receivers and antennas.</p>
              </a>
            </div>
          </Container>
        </section>

        {/* OUR PROJECTS */}
        <section className={styles.section} id="projects">
          <Container>
            <SectionHeading 
              title="BUILT FOR REAL-WORLD MISSIONS" 
              subtitle="Explore UAV projects and solutions developed for different applications."
            />
            
            <div className={styles.grid3}>
              <ProjectCard 
                title="Agricultural Mapping UAV"
                client="Agriculture"
                image="/images/projects/agriculture.jpg"
                description="A custom fixed-wing VTOL platform designed for multispectral imaging and crop health analysis."
              />
              <ProjectCard 
                title="Industrial Inspection Drone"
                client="Infrastructure"
                image="/images/projects/inspection.jpg"
                description="Heavy-duty quadcopter with thermal imaging and obstacle avoidance for power line inspection."
              />
              <ProjectCard 
                title="Autonomous Surveillance Drone"
                client="Security"
                image="/images/projects/surveillance.jpg"
                description="Tethered and free-flight capable surveillance platform with AI-based subject tracking."
              />
            </div>
          </Container>
        </section>

        {/* CUSTOM PROJECT CTA */}
        <section className={styles.section} id="custom-projects">
          <Container>
            <div className={styles.ctaBox}>
              <h2 className={styles.ctaTitle}>HAVE A DRONE PROJECT IN MIND?</h2>
              <p className={styles.ctaDesc}>
                Tell us what you're building. From college projects to custom UAV solutions, our team can help turn your idea into a working system.
              </p>
              <div className={styles.ctaActions}>
                <Button variant="primary" size="lg">START YOUR PROJECT</Button>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi YOURSTORE, I have a drone project requirement. I'd like to discuss it with your team.")}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg" style={{ pointerEvents: 'none' }}>CHAT ON WHATSAPP</Button>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* WHY YOURSTORE */}
        <section className={`${styles.section} ${styles.sectionDark}`} id="about">
          <Container>
            <div className={styles.grid4}>
              <div className={styles.whyItem}>
                <div className={styles.whyNumber}>01</div>
                <h3 className={styles.whyTitle}>QUALITY COMPONENTS</h3>
                <p className={styles.whyDesc}>Reliable drone hardware and components.</p>
              </div>
              <div className={styles.whyItem}>
                <div className={styles.whyNumber}>02</div>
                <h3 className={styles.whyTitle}>EXPERT SUPPORT</h3>
                <p className={styles.whyDesc}>Technical guidance when you need it.</p>
              </div>
              <div className={styles.whyItem}>
                <div className={styles.whyNumber}>03</div>
                <h3 className={styles.whyTitle}>CUSTOM SOLUTIONS</h3>
                <p className={styles.whyDesc}>From idea to working UAV project.</p>
              </div>
              <div className={styles.whyItem}>
                <div className={styles.whyNumber}>04</div>
                <h3 className={styles.whyTitle}>DIRECT ASSISTANCE</h3>
                <p className={styles.whyDesc}>Talk directly with our team through WhatsApp.</p>
              </div>
            </div>
          </Container>
        </section>

        {/* FINAL CTA */}
        <section className={styles.section}>
          <Container>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--spacing-md)' }}>READY TO BUILD?</h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                Explore our components or tell us about your next UAV project.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                <Button variant="primary">EXPLORE PRODUCTS</Button>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi YOURSTORE, I'd like to discuss a project.")}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" style={{ pointerEvents: 'none' }}>CONTACT US</Button>
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
