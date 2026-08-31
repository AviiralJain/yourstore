import mongoose, { Schema, Document } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure a subcategory name is unique within its category
SubcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

export default mongoose.models.Subcategory || mongoose.model<ISubcategory>('Subcategory', SubcategorySchema);
