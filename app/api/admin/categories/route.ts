import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import Subcategory from '@/lib/models/Subcategory';
import Project from '@/lib/models/Project';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { CategorySchema } = await import('@/lib/validations/admin');
    const parsed = CategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    // Check if category slug already exists
    const existing = await Category.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 409 });
    }

    const category = new Category(data);
    await category.save();

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const includeTree = searchParams.get('tree') === 'true';
    const searchQuery = searchParams.get('search');

    let query: any = {};
    if (searchQuery) {
      const normalizedSearch = searchQuery.trim().slice(0, 100);
      if (normalizedSearch) {
        const escapedSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(escapedSearch, 'i');
        query.$or = [{ name: searchRegex }, { slug: searchRegex }];
      }
    }

    const categories = await Category.find(query).sort({ createdAt: -1 }).lean();

    if (includeTree) {
      // Also fetch subcategories and project counts to form the tree
      const subcategories = await Subcategory.find().sort({ createdAt: -1 }).lean();
      
      const projectCountsByCategory = await Project.aggregate([
        { $group: { _id: '$categoryId', count: { $sum: 1 } } }
      ]);
      const projectCountsBySub = await Project.aggregate([
        { $group: { _id: '$subcategoryId', count: { $sum: 1 } } }
      ]);

      const catCounts = Object.fromEntries(projectCountsByCategory.map(c => [c._id?.toString(), c.count]));
      const subCounts = Object.fromEntries(projectCountsBySub.map(c => [c._id?.toString(), c.count]));

      const tree = categories.map(cat => {
        const catId = cat._id.toString();
        const subs = subcategories
          .filter(sub => sub.categoryId?.toString() === catId)
          .map(sub => ({
            ...sub,
            projectCount: subCounts[sub._id.toString()] || 0
          }));
        
        return {
          ...cat,
          projectCount: catCounts[catId] || 0,
          subcategoryCount: subs.length,
          subcategories: subs
        };
      });

      return NextResponse.json(tree, { status: 200 });
    }
    
    // Normal flat list
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
