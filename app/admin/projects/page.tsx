import React from 'react';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import styles from '../admin.module.css';
import Link from 'next/link';
import DeleteButton from '../components/DeleteButton';

export default async function AdminProjectsPage() {
  await connectToDatabase();
  
  const projects = await Project.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects</h1>
        <Link href="/admin/projects/new" className={styles.button} style={{ padding: '0.5rem 1rem', textDecoration: 'none', backgroundColor: 'var(--accent-primary)', color: '#050705', borderRadius: '4px', fontWeight: 700 }}>
          + Add Project
        </Link>
      </div>

      <div className={styles.card}>
        {projects.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No projects found.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project: any) => (
                  <tr key={project._id.toString()}>
                    <td style={{ fontWeight: 500 }}>{project.title}</td>
                    <td>{project.category}</td>
                    <td>{project.client || 'N/A'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${project.isActive ? styles.statusProgress : styles.statusClosed}`}>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/projects/${project._id}`} style={{ color: 'var(--accent-primary)', marginRight: '1rem', fontWeight: 600 }}>
                        Edit
                      </Link>
                      <DeleteButton endpoint="/api/admin/projects" id={project._id.toString()} itemName="project" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
