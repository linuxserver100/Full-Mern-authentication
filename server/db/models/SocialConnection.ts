import mongoose, { Document, Schema } from 'mongoose';

export interface SocialConnectionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  provider: string;
  providerId: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

const SocialConnectionSchema = new Schema<SocialConnectionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  data: { type: Schema.Types.Mixed, default: {} },
}, {
  timestamps: true
});

// Create compound index for userId + provider to ensure uniqueness
SocialConnectionSchema.index({ userId: 1, provider: 1 }, { unique: true });
// Create index for providerId to support lookups by external ID
SocialConnectionSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const SocialConnection = mongoose.model<SocialConnectionDocument>('SocialConnection', SocialConnectionSchema);

export default SocialConnection;