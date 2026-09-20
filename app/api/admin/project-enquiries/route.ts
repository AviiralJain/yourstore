import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import ProjectEnquiry from '@/lib/models/ProjectEnquiry';
import { requireAdmin } from '@/lib/auth/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const normalizedSearch = search.trim().slice(0, 100);
      if (normalizedSearch) {
        const escapedSearch = normalizedSearch.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        );
        const searchRegex = new RegExp(escapedSearch, 'i');
        query.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { projectTitle: searchRegex },
          { projectDomain: searchRegex }
        ];
      }
    }

    const [enquiries, counts] = await Promise.all([
      ProjectEnquiry.find(query).sort({ createdAt: -1 }).lean(),
      ProjectEnquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const stats = {
      total: 0,
      new: 0,
      contacted: 0,
      in_discussion: 0,
      in_development: 0,
      completed: 0,
      closed: 0
    };

    counts.forEach((c) => {
      if (c._id === 'new') stats.new = c.count;
      else if (c._id === 'contacted') stats.contacted = c.count;
      else if (c._id === 'in_discussion') stats.in_discussion = c.count;
      else if (c._id === 'in_development') stats.in_development = c.count;
      else if (c._id === 'completed') stats.completed = c.count;
      else if (c._id === 'closed') stats.closed = c.count;
      stats.total += c.count;
    });

    return NextResponse.json({
      enquiries,
      stats
    });

  } catch (error: any) {
    console.error('Project Enquiries API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch project enquiries' }, { status: 500 });
  }
}
