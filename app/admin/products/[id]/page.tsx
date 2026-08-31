import React from 'react';
import ProductForm from '../../components/ProductForm';
import connectToDatabase from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import styles from '../../admin.module.css';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  
  const product = await Product.findById(id).lean();
  if (!product) notFound();

  const categories = await Category.find({ isActive: true }).lean();
  const subcategories = await Subcategory.find({ isActive: true }).lean();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Edit Product</h1>
      </div>
      
      <ProductForm 
        product={{...product, _id: product._id.toString(), categoryId: product.categoryId.toString(), subcategoryId: product.subcategoryId?.toString(), createdAt: null, updatedAt: null}}
        categories={categories.map(c => ({...c, _id: c._id.toString(), createdAt: null, updatedAt: null}))} 
        subcategories={subcategories.map(s => ({...s, _id: s._id.toString(), categoryId: s.categoryId.toString(), createdAt: null, updatedAt: null}))} 
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
