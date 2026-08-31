import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Enquiry from '@/lib/models/Enquiry';
import Category from '@/lib/models/Category';
import { z } from 'zod';

const EnquiryFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  phone: z.string().min(10, "Invalid phone number").max(15, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  projectType: z.string().min(1, "Project type is required"),
  description: z.string().min(10, "Description is too short").max(2000, "Description is too long"),
  budget: z.string().optional(),
  deadline: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parsed = EnquiryFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;

    await connectToDatabase();
    
    // Verify category exists
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists || !categoryExists.isActive) {
      return NextResponse.json({ error: 'Selected category is invalid or inactive' }, { status: 400 });
    }
    
    const enquiry = new Enquiry({
      ...data,
      status: 'NEW'
    });

    await enquiry.save();
    
    return NextResponse.json({ success: true, message: 'Enquiry submitted successfully', enquiryId: enquiry._id }, { status: 201 });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
