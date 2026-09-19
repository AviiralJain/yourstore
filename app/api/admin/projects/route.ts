import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    
    const { ProjectSchema } = await import('@/lib/validations/admin');
    const parsed = ProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });
    }
    const data = parsed.data;

    await connectToDatabase();
    
    // Validate category and subcategory
    const Category = (await import('@/lib/models/Category')).default;
    const Subcategory = (await import('@/lib/models/Subcategory')).default;
    
    const category = await Category.findById(data.categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    if (data.subcategoryId) {
      const subcategory = await Subcategory.findById(data.subcategoryId);
      if (!subcategory) {
        return NextResponse.json({ error: 'Invalid subcategory' }, { status: 400 });
      }
      if (subcategory.categoryId.toString() !== data.categoryId) {
        return NextResponse.json({ error: 'Subcategory does not belong to the selected category' }, { status: 400 });
      }
    }
    
    const existing = await Project.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: 'Project slug already exists' }, { status: 409 });
    }

    const project = new Project(data);
    await project.save();

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();
    
    const projects = await Project.find().populate('categoryId').sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
