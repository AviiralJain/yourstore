import React from 'react';
import ProductForm from '../../components/ProductForm';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import styles from '../../admin.module.css';

export default async function NewProductPage() {
  await connectToDatabase();
  
  const categories = await Category.find({ isActive: true }).lean();
  const subcategories = await Subcategory.find({ isActive: true }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Add New Product</h1>
      </div>
      
      {/* Serialize dates for Client Component */}
      <ProductForm 
        categories={categories.map(c => ({...c, _id: c._id.toString(), createdAt: null, updatedAt: null}))} 
        subcategories={subcategories.map(s => ({...s, _id: s._id.toString(), categoryId: s.categoryId.toString(), createdAt: null, updatedAt: null}))} 
      />
    </div>
  );
}

export const dynamic = 'force-dynamic';
