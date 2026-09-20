import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Project from '@/lib/models/Project';
import ProjectEnquiry from '@/lib/models/ProjectEnquiry';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();

    // Parallel execution of aggregation queries
    const [
      totalProjects,
      activeProjects,
      featuredProjects,
      newEnquiries,
      recentEnquiries
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ active: true }),
      Project.countDocuments({ featured: true }),
      ProjectEnquiry.countDocuments({ status: 'new' }),
      ProjectEnquiry.find()
        .select('_id name projectTitle projectDomain userType status createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    return NextResponse.json({
      projectStats: {
        total: totalProjects,
        active: activeProjects,
        featured: featuredProjects
      },
      enquiryStats: {
        new: newEnquiries
      },
      recentEnquiries
    });

  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
