import React from 'react';
import SubcategoryForm from '../../components/SubcategoryForm';
import connectToDatabase from '@/lib/db/mongodb';
import Subcategory from '@/lib/models/Subcategory';
import Category from '@/lib/models/Category';
import styles from '../../admin.module.css';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function EditSubcategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  
  const subcategory = await Subcategory.findById(id).lean();
  if (!subcategory) notFound();

  const categories = await Category.find({ isActive: true }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Subcategory</h1>
      </div>
      
      <SubcategoryForm 
        subcategory={{...subcategory, _id: subcategory._id.toString(), categoryId: subcategory.categoryId.toString(), createdAt: null, updatedAt: null}}
        categories={categories.map(c => ({...c, _id: c._id.toString(), createdAt: null, updatedAt: null}))}
      />
    </div>
  );
}
