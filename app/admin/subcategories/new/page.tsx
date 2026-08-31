import React from 'react';
import SubcategoryForm from '../../components/SubcategoryForm';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import styles from '../../admin.module.css';

export const dynamic = "force-dynamic";

export default async function NewSubcategoryPage() {
  await connectToDatabase();
  const categories = await Category.find({ isActive: true }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add New Subcategory</h1>
      </div>
      
      <SubcategoryForm 
        categories={categories.map(c => ({...c, _id: c._id.toString(), createdAt: null, updatedAt: null}))}
      />
    </div>
  );
}
