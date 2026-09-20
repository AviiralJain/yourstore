import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import FormOption from '@/lib/models/FormOption';
import { requireAdmin } from '@/lib/auth/adminAuth';
import { seedFormOptions } from '@/lib/seedFormOptions';

const ALLOWED_GROUPS = [
  'project_domain', 
  'user_type', 
  'current_stage', 
  'timeline', 
  'preferred_contact_method', 
  'technology'
];

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    await connectToDatabase();
    
    // Attempt to seed if empty
    await seedFormOptions();
    
    // Fetch all options
    const options = await FormOption.find().sort({ group: 1, displayOrder: 1 });
    return NextResponse.json(options, { status: 200 });
  } catch (error) {
    console.error('Error fetching form options:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    let { group, label, value, active, displayOrder } = body;
    
    if (!group || !ALLOWED_GROUPS.includes(group)) {
      return NextResponse.json({ error: 'Invalid or missing group' }, { status: 400 });
    }

    if (typeof label !== 'string' || label.trim() === '') {
      return NextResponse.json({ error: 'Label must be a non-empty string' }, { status: 400 });
    }
    
    if (typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json({ error: 'Value must be a non-empty string' }, { status: 400 });
    }

    label = label.trim();
    value = value.trim();
    active = typeof active === 'boolean' ? active : true;
    displayOrder = (typeof displayOrder === 'number' && Number.isFinite(displayOrder) && displayOrder >= 0) ? displayOrder : 0;

    await connectToDatabase();
    
    const newOption = new FormOption({
      group,
      label,
      value,
      active,
      displayOrder
    });
    
    await newOption.save();
    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    console.error('Error creating form option:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
