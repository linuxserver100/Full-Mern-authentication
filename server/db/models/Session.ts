import mongoose, { Document, Schema } from 'mongoose';

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  location: string | null;
  timezone: string | null;
  expiresAt: Date;
  createdAt: Date;
}

const SessionSchema = new Schema<SessionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  location: { type: String, default: null },
  timezone: { type: String, default: null },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for common lookups
SessionSchema.index({ token: 1 });
SessionSchema.index({ userId: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic cleanup

export const Session = mongoose.model<SessionDocument>('Session', SessionSchema);

export default Session;