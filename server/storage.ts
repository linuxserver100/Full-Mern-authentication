import { users, socialConnections, sessions } from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  SocialConnection, 
  InsertSocialConnection,
  Session,
  InsertSession
} from "@shared/schema";

// modify the interface with CRUD methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;

  // Social connection operations
  getSocialConnection(userId: number, provider: string): Promise<SocialConnection | undefined>;
  getSocialConnectionByProviderId(provider: string, providerId: string): Promise<SocialConnection | undefined>;
  createSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection>;
  deleteSocialConnection(id: number): Promise<boolean>;
  getUserSocialConnections(userId: number): Promise<SocialConnection[]>;

  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  getUserSessions(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  deleteSession(id: number): Promise<boolean>;
  deleteUserSessions(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private socialConnectionStore: Map<number, SocialConnection>;
  private sessionStore: Map<number, Session>;
  private currentUserId: number;
  private currentSocialConnectionId: number;
  private currentSessionId: number;

  constructor() {
    this.userStore = new Map();
    this.socialConnectionStore = new Map();
    this.sessionStore = new Map();
    this.currentUserId = 1;
    this.currentSocialConnectionId = 1;
    this.currentSessionId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.verificationToken === token,
    );
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.resetPasswordToken === token && 
      user.resetPasswordExpires && 
      new Date(user.resetPasswordExpires) > new Date(),
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      isVerified: userData.isVerified ?? false,
      twoFactorEnabled: userData.twoFactorEnabled ?? false,
      createdAt: userData.createdAt || now,
      updatedAt: userData.updatedAt || now,
    };
    this.userStore.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    
    this.userStore.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userStore.delete(id);
  }

  // Social connection operations
  async getSocialConnection(userId: number, provider: string): Promise<SocialConnection | undefined> {
    return Array.from(this.socialConnectionStore.values()).find(
      (conn) => conn.userId === userId && conn.provider === provider,
    );
  }

  async getSocialConnectionByProviderId(provider: string, providerId: string): Promise<SocialConnection | undefined> {
    return Array.from(this.socialConnectionStore.values()).find(
      (conn) => conn.provider === provider && conn.providerId === providerId,
    );
  }

  async createSocialConnection(connectionData: InsertSocialConnection): Promise<SocialConnection> {
    const id = this.currentSocialConnectionId++;
    const now = new Date();
    const connection: SocialConnection = {
      ...connectionData,
      id,
      createdAt: connectionData.createdAt || now,
      updatedAt: connectionData.updatedAt || now,
    };
    this.socialConnectionStore.set(id, connection);
    return connection;
  }

  async deleteSocialConnection(id: number): Promise<boolean> {
    return this.socialConnectionStore.delete(id);
  }

  async getUserSocialConnections(userId: number): Promise<SocialConnection[]> {
    return Array.from(this.socialConnectionStore.values()).filter(
      (conn) => conn.userId === userId,
    );
  }

  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessionStore.get(id);
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    return Array.from(this.sessionStore.values()).find(
      (session) => session.token === token && new Date(session.expiresAt) > new Date(),
    );
  }

  async getUserSessions(userId: number): Promise<Session[]> {
    return Array.from(this.sessionStore.values()).filter(
      (session) => session.userId === userId && new Date(session.expiresAt) > new Date(),
    );
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const now = new Date();
    const session: Session = {
      ...sessionData,
      id,
      createdAt: sessionData.createdAt || now,
    };
    this.sessionStore.set(id, session);
    return session;
  }

  async deleteSession(id: number): Promise<boolean> {
    return this.sessionStore.delete(id);
  }

  async deleteUserSessions(userId: number): Promise<boolean> {
    const userSessions = await this.getUserSessions(userId);
    let success = true;
    
    for (const session of userSessions) {
      const result = await this.deleteSession(session.id);
      if (!result) success = false;
    }
    
    return success;
  }
}

export const storage = new MemStorage();
