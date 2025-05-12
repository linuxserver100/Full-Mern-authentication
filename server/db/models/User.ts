import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  username: string;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  isVerified: boolean;
  verificationToken: string | null;
  verificationExpires: Date | null;
  resetToken: string | null;
  resetExpires: Date | null;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationExpires: { type: Date, default: null },
  resetToken: { type: String, default: null },
  resetExpires: { type: Date, default: null },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: null },
  profilePicture: { type: String, default: null },
}, {
  timestamps: true
});

// Create indexes for common lookups
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetToken: 1 });

export const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;