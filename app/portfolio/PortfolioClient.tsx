"use client";

import React, { useState, useMemo } from 'react';
import { ProjectCard } from '@/app/components/ProjectCard';
import { Container } from '@/app/components/Container';
import styles from './portfolio.module.css';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  projectType: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  categoryId: string | null;
  subcategoryId: string | null;
  technologies: string[];
}

interface PortfolioClientProps {
  projects: Project[];
  categories: Category[];
  subcategories: Subcategory[];
}

export const PortfolioClient: React.FC<PortfolioClientProps> = ({ projects, categories, subcategories }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  // Filter out categories that have no active projects
  const relevantCategories = useMemo(() => {
    const categoryIds = new Set(projects.map(p => p.categoryId).filter(Boolean));
    return categories.filter(c => categoryIds.has(c._id.toString()));
  }, [projects, categories]);

  const relevantSubcategories = useMemo(() => {
    if (!activeCategory) return [];
    return subcategories.filter(s => s.categoryId?.toString() === activeCategory);
  }, [activeCategory, subcategories]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (activeCategory && p.categoryId?.toString() !== activeCategory) return false;
      if (activeSubcategory && p.subcategoryId?.toString() !== activeSubcategory) return false;
      return true;
    });
  }, [projects, activeCategory, activeSubcategory]);

  const handleCategoryClick = (catId: string | null) => {
    setActiveCategory(catId);
    setActiveSubcategory(null);
  };

  const getCategoryName = (id: string | null) => {
    if (!id) return '';
    const cat = categories.find(c => c._id.toString() === id);
    return cat ? cat.name : '';
  };

  const getSubcategoryName = (id: string | null) => {
    if (!id) return '';
    const sub = subcategories.find(s => s._id.toString() === id);
    return sub ? sub.name : '';
  };

  return (
    <div className={styles.portfolioContainer}>
      <Container>
        {/* FILTERS */}
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <button 
              className={`${styles.filterBtn} ${!activeCategory ? styles.active : ''}`}
              onClick={() => handleCategoryClick(null)}
            >
              ALL PROJECTS
            </button>
            {relevantCategories.map(cat => (
              <button 
                key={cat._id.toString()}
                className={`${styles.filterBtn} ${activeCategory === cat._id.toString() ? styles.active : ''}`}
                onClick={() => handleCategoryClick(cat._id.toString())}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          {activeCategory && relevantSubcategories.length > 0 && (
            <div className={styles.subFilterGroup}>
              <button 
                className={`${styles.subFilterBtn} ${!activeSubcategory ? styles.active : ''}`}
                onClick={() => setActiveSubcategory(null)}
              >
                All {getCategoryName(activeCategory)}
              </button>
              {relevantSubcategories.map(sub => (
                <button 
                  key={sub._id.toString()}
                  className={`${styles.subFilterBtn} ${activeSubcategory === sub._id.toString() ? styles.active : ''}`}
                  onClick={() => setActiveSubcategory(sub._id.toString())}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PROJECT GRID */}
        {filteredProjects.length > 0 ? (
          <div className={styles.grid}>
            {filteredProjects.map(project => (
              <ProjectCard
                key={project._id.toString()}
                title={project.title}
                projectType={project.projectType}
                description={project.shortDescription || project.fullDescription}
                image={project.images && project.images.length > 0 ? project.images[0] : undefined}
                slug={project.slug}
                category={getCategoryName(project.categoryId)}
                subcategory={getSubcategoryName(project.subcategoryId)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No projects available for the selected filters.</p>
          </div>
        )}
      </Container>
    </div>
  );
};
