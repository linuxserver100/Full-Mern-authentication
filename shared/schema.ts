import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username").notNull().unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationExpires: timestamp("verification_expires"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  twoFactorSecret: text("two_factor_secret"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialConnections = pgTable("social_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: text("provider").notNull(), // 'google', 'github', etc.
  providerId: text("provider_id").notNull(),
  data: jsonb("data"), // Store additional data from the provider
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
  timezone: text("timezone"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Basic registration schema
export const registerUserSchema = createInsertSchema(users)
  .pick({
    email: true,
    username: true,
    password: true,
    firstName: true,
    lastName: true,
  })
  .extend({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Password Reset Request schema
export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Password Reset schema
export const passwordResetSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile Update schema
export const profileUpdateSchema = createInsertSchema(users)
  .pick({
    firstName: true,
    lastName: true,
    username: true,
    profilePicture: true,
  })
  .partial();

// Email Change schema
export const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Password Change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// 2FA Setup schema
export const twoFactorSetupSchema = z.object({
  code: z.string().min(6).max(6),
});

// 2FA Verification schema
export const twoFactorVerifySchema = z.object({
  code: z.string().min(6).max(6),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type EmailChange = z.infer<typeof emailChangeSchema>;
export type PasswordChange = z.infer<typeof passwordChangeSchema>;
export type TwoFactorSetup = z.infer<typeof twoFactorSetupSchema>;
export type TwoFactorVerify = z.infer<typeof twoFactorVerifySchema>;
export type SocialConnection = typeof socialConnections.$inferSelect;
export type InsertSocialConnection = typeof socialConnections.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
