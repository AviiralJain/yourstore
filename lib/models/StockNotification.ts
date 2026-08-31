import mongoose, { Schema, Document } from 'mongoose';

export interface IStockNotification extends Document {
  productId: mongoose.Types.ObjectId;
  email: string;
  customerName?: string;
  phone?: string;
  status: 'WAITING' | 'NOTIFIED';
  createdAt: Date;
  updatedAt: Date;
}

const StockNotificationSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    email: { type: String, required: true },
    customerName: { type: String },
    phone: { type: String },
    status: { type: String, enum: ['WAITING', 'NOTIFIED'], default: 'WAITING' },
  },
  { timestamps: true }
);

export default mongoose.models.StockNotification || mongoose.model<IStockNotification>('StockNotification', StockNotificationSchema);
