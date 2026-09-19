import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import ProjectEnquiry from '@/lib/models/ProjectEnquiry';
import { RateLimit } from '@/lib/models/RateLimit';
import { z } from 'zod';

const ProjectEnquirySchema = z.object({
  name: z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Invalid phone number').max(20, 'Invalid phone number'),
  userType: z.string().min(1, 'Please tell us who you are'),
  projectDomain: z.string().min(1, 'Please select a project domain'),
  projectTitle: z.string().optional(),
  description: z.string().min(10, 'Description is too short').max(5000, 'Description is too long'),
  currentStage: z.string().optional(),
  technologies: z.string().optional(),
  requirements: z.string().optional(),
  timeline: z.string().optional(),
  additionalInformation: z.string().optional(),
  preferredContactMethod: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await connectToDatabase();

    if (ip !== 'unknown') {
      const rateLimitDoc = await RateLimit.findOne({ ip, action: 'project_enquiry' });
      if (rateLimitDoc) {
        if (rateLimitDoc.attempts >= 5) {
          // Block if more than 5 attempts within the 1-hour window
          return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }
        rateLimitDoc.attempts += 1;
        rateLimitDoc.lastAttempt = new Date();
        await rateLimitDoc.save();
      } else {
        await RateLimit.create({ ip, action: 'project_enquiry', attempts: 1 });
      }
    }

    const body = await request.json();
    
    const parsed = ProjectEnquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;
    
    const enquiry = new ProjectEnquiry({
      ...data,
      status: 'new'
    });

    await enquiry.save();
    
    return NextResponse.json({ success: true, message: 'Project requirement submitted successfully', enquiryId: enquiry._id }, { status: 201 });
  } catch (error) {
    console.error('Error submitting project enquiry:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Something went wrong while submitting your requirement. Please try again.' }, { status: 500 });
  }
}

