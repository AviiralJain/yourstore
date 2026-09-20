import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId?: mongoose.Types.ObjectId;
  shortDescription?: string;
  fullDescription?: string;
  images: string[];
  mediaIds?: mongoose.Types.ObjectId[];
  technologies: string[];
  hardware: string[];
  software: string[];
  features: string[];
  projectType?: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
    shortDescription: { type: String },
    fullDescription: { type: String },
    images: [{ type: String }],
    mediaIds: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    technologies: [{ type: String }],
    hardware: [{ type: String }],
    software: [{ type: String }],
    features: [{ type: String }],
    projectType: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
