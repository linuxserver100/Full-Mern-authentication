import { IStorage } from './storage';
import User, { UserDocument } from './db/models/User';
import SocialConnection, { SocialConnectionDocument } from './db/models/SocialConnection';
import Session, { SessionDocument } from './db/models/Session';
import { connectToMongoDB } from './db/mongodb';
import mongoose from 'mongoose';
import { User as UserType, InsertUser, SocialConnection as SocialConnectionType, InsertSocialConnection, Session as SessionType, InsertSession } from '@shared/schema';

/**
 * MongoDB implementation of the storage interface
 */
export class MongoDBStorage implements IStorage {
  constructor() {
    // Connect to MongoDB when storage is initialized
    this.init();
  }

  async init() {
    try {
      await connectToMongoDB();
      console.log('MongoDB storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MongoDB storage:', error);
    }
  }

  // Helper methods to convert between MongoDB and schema types
  private userDocToUser(doc: UserDocument): UserType {
    return {
      id: doc._id.toString() as unknown as number,
      email: doc.email,
      username: doc.username,
      password: doc.password,
      firstName: doc.firstName,
      lastName: doc.lastName,
      isVerified: doc.isVerified,
      verificationToken: doc.verificationToken,
      verificationExpires: doc.verificationExpires,
      resetToken: doc.resetToken,
      resetExpires: doc.resetExpires,
      twoFactorEnabled: doc.twoFactorEnabled,
      twoFactorSecret: doc.twoFactorSecret,
      profilePicture: doc.profilePicture,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private socialConnectionDocToSocialConnection(doc: SocialConnectionDocument): SocialConnectionType {
    return {
      id: doc._id.toString() as unknown as number,
      userId: doc.userId.toString() as unknown as number,
      provider: doc.provider,
      providerId: doc.providerId,
      data: doc.data,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private sessionDocToSession(doc: SessionDocument): SessionType {
    return {
      id: doc._id.toString() as unknown as number,
      userId: doc.userId.toString() as unknown as number,
      token: doc.token,
      ipAddress: doc.ipAddress,
      userAgent: doc.userAgent,
      location: doc.location,
      timezone: doc.timezone,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt
    };
  }

  // User operations
  async getUser(id: number): Promise<UserType | undefined> {
    try {
      const user = await User.findById(id.toString());
      return user ? this.userDocToUser(user) : undefined;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<UserType | undefined> {
    try {
      const user = await User.findOne({ email });
      return user ? this.userDocToUser(user) : undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    try {
      const user = await User.findOne({ username });
      return user ? this.userDocToUser(user) : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByVerificationToken(token: string): Promise<UserType | undefined> {
    try {
      const user = await User.findOne({ verificationToken: token });
      return user ? this.userDocToUser(user) : undefined;
    } catch (error) {
      console.error('Error getting user by verification token:', error);
      return undefined;
    }
  }

  async getUserByResetToken(token: string): Promise<UserType | undefined> {
    try {
      const user = await User.findOne({ resetToken: token });
      return user ? this.userDocToUser(user) : undefined;
    } catch (error) {
      console.error('Error getting user by reset token:', error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<UserType> {
    try {
      const newUser = await User.create(userData);
      return this.userDocToUser(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<UserType> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id.toString(),
        { $set: data },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      return this.userDocToUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id.toString());
      return !!result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Social connection operations
  async getSocialConnection(userId: number, provider: string): Promise<SocialConnectionType | undefined> {
    try {
      const connection = await SocialConnection.findOne({
        userId: userId.toString(),
        provider
      });
      return connection ? this.socialConnectionDocToSocialConnection(connection) : undefined;
    } catch (error) {
      console.error('Error getting social connection:', error);
      return undefined;
    }
  }

  async getSocialConnectionByProviderId(provider: string, providerId: string): Promise<SocialConnectionType | undefined> {
    try {
      const connection = await SocialConnection.findOne({ provider, providerId });
      return connection ? this.socialConnectionDocToSocialConnection(connection) : undefined;
    } catch (error) {
      console.error('Error getting social connection by provider ID:', error);
      return undefined;
    }
  }

  async createSocialConnection(connectionData: InsertSocialConnection): Promise<SocialConnectionType> {
    try {
      // Convert userId to ObjectId if it's a number
      const data = {
        ...connectionData,
        userId: connectionData.userId.toString()
      };
      
      const newConnection = await SocialConnection.create(data);
      return this.socialConnectionDocToSocialConnection(newConnection);
    } catch (error) {
      console.error('Error creating social connection:', error);
      throw error;
    }
  }

  async deleteSocialConnection(id: number): Promise<boolean> {
    try {
      const result = await SocialConnection.findByIdAndDelete(id.toString());
      return !!result;
    } catch (error) {
      console.error('Error deleting social connection:', error);
      return false;
    }
  }

  async getUserSocialConnections(userId: number): Promise<SocialConnectionType[]> {
    try {
      const connections = await SocialConnection.find({ userId: userId.toString() });
      return connections.map(conn => this.socialConnectionDocToSocialConnection(conn));
    } catch (error) {
      console.error('Error getting user social connections:', error);
      return [];
    }
  }

  // Session operations
  async getSession(id: number): Promise<SessionType | undefined> {
    try {
      const session = await Session.findById(id.toString());
      return session ? this.sessionDocToSession(session) : undefined;
    } catch (error) {
      console.error('Error getting session:', error);
      return undefined;
    }
  }

  async getSessionByToken(token: string): Promise<SessionType | undefined> {
    try {
      const session = await Session.findOne({ token });
      return session ? this.sessionDocToSession(session) : undefined;
    } catch (error) {
      console.error('Error getting session by token:', error);
      return undefined;
    }
  }

  async getUserSessions(userId: number): Promise<SessionType[]> {
    try {
      const sessions = await Session.find({ userId: userId.toString() });
      return sessions.map(session => this.sessionDocToSession(session));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  async createSession(sessionData: InsertSession): Promise<SessionType> {
    try {
      // Convert userId to ObjectId if it's a number
      const data = {
        ...sessionData,
        userId: sessionData.userId.toString()
      };
      
      const newSession = await Session.create(data);
      return this.sessionDocToSession(newSession);
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async deleteSession(id: number): Promise<boolean> {
    try {
      const result = await Session.findByIdAndDelete(id.toString());
      return !!result;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  async deleteUserSessions(userId: number): Promise<boolean> {
    try {
      const result = await Session.deleteMany({ userId: userId.toString() });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user sessions:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const mongoDBStorage = new MongoDBStorage();