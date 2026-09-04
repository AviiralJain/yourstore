import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    
    const formattedProjects = projects.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    }));

    console.log("Mongoose connected successfully!");
    return NextResponse.json(formattedProjects, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
