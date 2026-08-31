import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId?: mongoose.Types.ObjectId;
  price: number;
  currency: string;
  specifications: { key: string; value: string }[];
  images: string[];
  featured: boolean;
  isActive: boolean;
  stockStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    stockStatus: { type: String, default: 'IN_STOCK' }, // e.g. IN_STOCK, OUT_OF_STOCK
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
