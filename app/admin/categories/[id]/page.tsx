import React from 'react';
import CategoryForm from '../../components/CategoryForm';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import styles from '../../admin.module.css';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  
  const category = await Category.findById(id).lean();
  if (!category) notFound();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Category</h1>
      </div>
      
      <CategoryForm 
        category={{...category, _id: category._id.toString(), createdAt: null, updatedAt: null}}
      />
    </div>
  );
}
