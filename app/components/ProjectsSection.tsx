"use client";

import React, { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import styles from '../page.module.css';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Projects are currently being updated.</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-color)', borderRadius: '8px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No projects available yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid3}>
      {projects.map(project => (
        <ProjectCard 
          key={project.id}
          title={project.title}
          client={project.client || ''}
          image={project.images && project.images.length > 0 ? project.images[0] : ''}
          description={project.shortDescription || project.description}
          slug={project.slug}
        />
      ))}
    </div>
  );
};
