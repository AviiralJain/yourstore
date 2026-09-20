import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  publicId: string;
  filename?: string;
  originalName?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  altText?: string;
  title?: string;
  description?: string;
  folder?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    width: { type: Number },
    height: { type: Number },
    altText: { type: String },
    title: { type: String },
    description: { type: String },
    folder: { type: String },
    type: { type: String, default: "image" },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
