export interface Comment {
  id: string;
  content: string;
  author: { name: string; image: string, id: string, role: Role };
  createdAt: string;
  parentId: string | null;
  replies: Comment[];
}

export interface Suggestion {
  id: string;
  slug: string;
  title: string;
  description: string;
  votes: { id: string; authorId: string }[];
  comments: Comment[];
  status: "PENDING" | "PLANNED" | "IN_PROGRESS" | "DONE";
  category: "SUGGESTION" | "BUG" | "FEEDBACK" | "FEATURE";
  author: { name: string; image: string, id: string, role: Role };
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  banned: boolean;
}

export interface Session {
  token: string;
  ipAddress: string;
  userAgent: string;
}

export interface AuthSession {
  data: {
    session: Session;
    user: User;
  } | null;
  error: null | Error;
}

export type Provider = "github" | "google" | "roblox" | "discord";

export type Role = "guest" | "admin" | "owner" | "staff" | "developer" | "contributor";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  banned: boolean;
  bannedReason: string | null;
  createdAt: string;
  _count: {
    suggestions: number;
    comments: number;
    votes: number;
  };
};