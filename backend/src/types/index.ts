export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  trustScore: number;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  ingredients: Ingredient[];
  certifications: string[];
  nutritionFacts?: Record<string, unknown>;
  submittedBy: string;
  submittedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
};

export type Ingredient = {
  id: string;
  name: string;
  allergen?: boolean;
  origin?: string;
  certifications?: string[];
};

export type Submission = {
  id: string;
  userId: string;
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  ingredients: Ingredient[];
  certifications: string[];
  nutritionFacts?: Record<string, unknown>;
  sourceUrl?: string;
  notes?: string;
  status: 'pending_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: string;
  userId: string;
  preferences: Record<string, unknown>;
  dietaryConditions: string[];
  allergens: string[];
  certificationPreferences: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type AuthTokens = {
  token: string;
  refreshToken: string;
};

export type JwtPayload = {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
};
