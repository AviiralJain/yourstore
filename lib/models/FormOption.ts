import mongoose, { Schema, Document } from 'mongoose';

export interface IFormOption extends Document {
  group: 'project_domain' | 'user_type' | 'current_stage' | 'timeline' | 'preferred_contact_method' | 'technology';
  label: string;
  value: string;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const FormOptionSchema: Schema = new Schema(
  {
    group: { 
      type: String, 
      required: true,
      enum: ['project_domain', 'user_type', 'current_stage', 'timeline', 'preferred_contact_method', 'technology']
    },
    label: { type: String, required: true },
    value: { type: String, required: true },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

FormOptionSchema.index({ group: 1, displayOrder: 1, active: 1 });

export default mongoose.models.FormOption || mongoose.model<IFormOption>('FormOption', FormOptionSchema);
