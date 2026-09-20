import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: string;
  title: string;
  message: string;
  enquiryId?: mongoose.Types.ObjectId;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    type: { type: String, required: true, enum: ['new_project_enquiry', 'enquiry_status_changed', 'security', 'system'] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    enquiryId: { type: Schema.Types.ObjectId, ref: 'ProjectEnquiry' },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ read: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ type: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
