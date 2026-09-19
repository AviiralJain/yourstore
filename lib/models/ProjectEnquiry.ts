import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  userType: string;
  projectDomain: string;
  projectTitle?: string;
  description: string;
  currentStage?: string;
  technologies?: string;
  requirements?: string;
  timeline?: string;
  additionalInformation?: string;
  preferredContactMethod?: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'in_development' | 'completed' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectEnquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userType: { type: String, required: true },
    projectDomain: { type: String, required: true },
    projectTitle: { type: String },
    description: { type: String, required: true },
    currentStage: { type: String },
    technologies: { type: String },
    requirements: { type: String },
    timeline: { type: String },
    additionalInformation: { type: String },
    preferredContactMethod: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in_discussion', 'in_development', 'completed', 'closed'],
      default: 'new'
    },
  },
  { timestamps: true }
);

export default mongoose.models.ProjectEnquiry || mongoose.model<IProjectEnquiry>('ProjectEnquiry', ProjectEnquirySchema);
