import mongoose from 'mongoose';

export interface IAdmin extends mongoose.Document {
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'ADMIN',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);
