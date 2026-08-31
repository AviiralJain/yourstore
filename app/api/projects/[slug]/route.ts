import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    
    const project = await Project.findOne({ slug, isActive: true }).lean();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const formattedProject = {
      ...project,
      id: project._id.toString(),
    };

    return NextResponse.json(formattedProject, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
