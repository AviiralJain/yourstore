import '@/lib/models/Media';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Featured projects must be both active and featured
    const projects = await Project.find({ active: true, featured: true })
      .populate('categoryId').populate({ path: 'mediaIds', select: 'url width height altText title' })
      .sort({ createdAt: -1 })
      .lean();
    
    const formattedProjects = projects.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    }));

    return NextResponse.json(formattedProjects, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching featured projects:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}


