import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Retrieve all active categories
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    const subcategories = await Subcategory.find({ isActive: true }).sort({ name: 1 }).lean();

    const formattedCategories = categories.map((cat: any) => ({
      ...cat,
      // Map MongoDB _id to string for the frontend, and add subcategories array
      id: cat._id.toString(),
      subcategories: subcategories
        .filter((sub: any) => sub.categoryId.toString() === cat._id.toString())
        .map((sub: any) => ({ ...sub, id: sub._id.toString() }))
    }));

    return NextResponse.json(formattedCategories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
