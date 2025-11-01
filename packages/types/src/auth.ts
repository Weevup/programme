import { z } from 'zod';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  PARTNER = 'PARTNER',
  CLIENT = 'CLIENT',
}

// Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// User
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
