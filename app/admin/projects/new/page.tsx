import React from 'react';
import ProjectForm from '../../components/ProjectForm';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import styles from '../../admin.module.css';

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await connectToDatabase();
  const categories = await Category.find({ isActive: true }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add New Project</h1>
      </div>
      
      <ProjectForm 
        categories={categories.map(c => ({...c, _id: c._id.toString(), createdAt: null, updatedAt: null}))}
      />
    </div>
  );
}
