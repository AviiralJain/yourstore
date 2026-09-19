import React from 'react';
import ProjectForm from '../../components/ProjectForm';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import styles from '../../admin.module.css';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  
  const project = await Project.findById(id).lean();
  if (!project) notFound();

  const categories = await Category.find({ isActive: true }).lean();
  const subcategories = await Subcategory.find({ isActive: true }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Project</h1>
      </div>
      
      <ProjectForm 
        project={{
          ...project, 
          _id: project._id.toString(), 
          categoryId: project.categoryId?.toString(), 
          subcategoryId: project.subcategoryId?.toString(),
          createdAt: null, 
          updatedAt: null
        }}
        categories={categories.map(c => ({...c, _id: c._id.toString(), createdAt: null, updatedAt: null}))}
        subcategories={subcategories.map(s => ({...s, _id: s._id.toString(), categoryId: s.categoryId?.toString(), createdAt: null, updatedAt: null}))}
      />
    </div>
  );
}
