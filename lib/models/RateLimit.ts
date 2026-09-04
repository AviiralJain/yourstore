import mongoose from 'mongoose';

export interface IRateLimit extends mongoose.Document {
  ip: string;
  action: string;
  attempts: number;
  lastAttempt: Date;
}

const rateLimitSchema = new mongoose.Schema<IRateLimit>(
  {
    ip: { type: String, required: true },
    action: { type: String, required: true },
    attempts: { type: Number, default: 1 },
    lastAttempt: { type: Date, default: Date.now },
  },
);

rateLimitSchema.index({ ip: 1, action: 1 }, { unique: true });
// Automatically clear documents older than 1 hour
rateLimitSchema.index({ lastAttempt: 1 }, { expireAfterSeconds: 3600 });

export const RateLimit = mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', rateLimitSchema);
