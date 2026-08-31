import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  category: string;
  description: string;
  budget?: string;
  deadline?: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    projectType: { type: String, required: true },
    category: { type: String },
    description: { type: String, required: true },
    budget: { type: String },
    deadline: { type: String },
    status: { 
      type: String, 
      enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'], 
      default: 'NEW' 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
