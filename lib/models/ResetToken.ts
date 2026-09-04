import mongoose from 'mongoose';

export interface IResetToken extends mongoose.Document {
  adminId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

const resetTokenSchema = new mongoose.Schema<IResetToken>(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const ResetToken = mongoose.models.ResetToken || mongoose.model<IResetToken>('ResetToken', resetTokenSchema);
