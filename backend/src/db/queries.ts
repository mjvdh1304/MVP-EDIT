import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';
import type { User, Product, Submission } from '../types/index.js';

// User queries
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, email, name, password_hash as "passwordHash", trust_score as "trustScore", is_banned as "isBanned", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  return (result.rows[0] as User) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, email, name, password_hash as "passwordHash", trust_score as "trustScore", is_banned as "isBanned", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
    [id]
  );
  return (result.rows[0] as User) || null;
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  await pool.query(
    'INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, email.toLowerCase(), name, passwordHash, now, now]
  );

  // Create user profile
  await pool.query(
    'INSERT INTO user_profiles (id, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4)',
    [randomUUID(), id, now, now]
  );

  return {
    id,
    email: email.toLowerCase(),
    name,
    passwordHash,
    trustScore: 0,
    isBanned: false,
    createdAt: now,
    updatedAt: now,
  };
}

// Product queries
export async function createProduct(
  barcode: string,
  name: string,
  brand: string | undefined,
  category: string | undefined,
  ingredients: unknown,
  certifications: string[],
  nutritionFacts: unknown | undefined,
  submittedBy: string
): Promise<Product> {
  const id = randomUUID();
  const now = new Date();

  await pool.query(
    `INSERT INTO products (id, barcode, name, brand, category, ingredients, certifications, nutrition_facts, submitted_by, submitted_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [id, barcode, name, brand || null, category || null, JSON.stringify(ingredients), certifications, JSON.stringify(nutritionFacts), submittedBy, now, now, now]
  );

  return {
    id,
    barcode,
    name,
    brand,
    category,
    ingredients: ingredients as any,
    certifications,
    nutritionFacts: nutritionFacts as Record<string, unknown> | undefined,
    submittedBy,
    submittedAt: now,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const result = await pool.query(
    'SELECT id, barcode, name, brand, category, ingredients, certifications, nutrition_facts as "nutritionFacts", submitted_by as "submittedBy", submitted_at as "submittedAt", verified_at as "verifiedAt", verified_by as "verifiedBy" FROM products WHERE id = $1',
    [id]
  );
  const row = result.rows[0] as any;
  if (!row) return null;
  return {
    ...row,
    ingredients: row.ingredients,
  };
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  const result = await pool.query(
    'SELECT id, barcode, name, brand, category, ingredients, certifications, nutrition_facts as "nutritionFacts", submitted_by as "submittedBy", submitted_at as "submittedAt", verified_at as "verifiedAt", verified_by as "verifiedBy" FROM products WHERE barcode = $1',
    [barcode]
  );
  const row = result.rows[0] as any;
  if (!row) return null;
  return {
    ...row,
    ingredients: row.ingredients,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await pool.query(
    'SELECT id, barcode, name, brand, category, ingredients, certifications, nutrition_facts as "nutritionFacts", submitted_by as "submittedBy", submitted_at as "submittedAt" FROM products ORDER BY submitted_at DESC LIMIT 100'
  );
  return result.rows.map((row: any) => ({
    ...row,
    ingredients: row.ingredients,
  }));
}

// Submission queries
export async function createSubmission(
  userId: string,
  barcode: string,
  name: string,
  brand: string | undefined,
  category: string | undefined,
  ingredients: unknown,
  certifications: string[],
  nutritionFacts: unknown | undefined,
  sourceUrl: string | undefined,
  notes: string | undefined,
  status: string
): Promise<Submission> {
  const id = randomUUID();
  const now = new Date();

  await pool.query(
    `INSERT INTO submissions (id, user_id, barcode, name, brand, category, ingredients, certifications, nutrition_facts, source_url, notes, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [id, userId, barcode, name, brand || null, category || null, JSON.stringify(ingredients), certifications, JSON.stringify(nutritionFacts), sourceUrl || null, notes || null, status, now, now]
  );

  return {
    id,
    userId,
    barcode,
    name,
    brand,
    category,
    ingredients: ingredients as any,
    certifications,
    nutritionFacts: nutritionFacts as Record<string, unknown> | undefined,
    sourceUrl,
    notes,
    status: status as 'pending_review' | 'approved' | 'rejected',
    createdAt: now,
    updatedAt: now,
  };
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const result = await pool.query(
    `SELECT id, user_id as "userId", barcode, name, brand, category, ingredients, certifications, nutrition_facts as "nutritionFacts", source_url as "sourceUrl", notes, status, rejection_reason as "rejectionReason", created_at as "createdAt", updated_at as "updatedAt"
     FROM submissions WHERE id = $1`,
    [id]
  );
  const row = result.rows[0] as any;
  if (!row) return null;
  return {
    ...row,
    ingredients: row.ingredients,
  };
}

export async function getUserSubmissions(userId: string): Promise<Submission[]> {
  const result = await pool.query(
    `SELECT id, user_id as "userId", barcode, name, brand, category, ingredients, certifications, nutrition_facts as "nutritionFacts", source_url as "sourceUrl", notes, status, rejection_reason as "rejectionReason", created_at as "createdAt", updated_at as "updatedAt"
     FROM submissions WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map((row: any) => ({
    ...row,
    ingredients: row.ingredients,
  }));
}

export async function getPendingSubmissions(limit = 50, offset = 0): Promise<Submission[]> {
  const result = await pool.query(
    `SELECT id, user_id as "userId", barcode, name, brand, category, ingredients, certifications, nutrition_facts as "nutritionFacts", source_url as "sourceUrl", notes, status, rejection_reason as "rejectionReason", created_at as "createdAt", updated_at as "updatedAt"
     FROM submissions WHERE status = 'pending_review' ORDER BY created_at ASC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows.map((row: any) => ({
    ...row,
    ingredients: row.ingredients,
  }));
}

export async function approveSubmission(submissionId: string, adminId: string): Promise<void> {
  const submission = await getSubmissionById(submissionId);
  if (!submission) throw new Error('Submission not found');

  const now = new Date();

  // Create product from submission
  await createProduct(
    submission.barcode,
    submission.name,
    submission.brand,
    submission.category,
    submission.ingredients,
    submission.certifications,
    submission.nutritionFacts,
    submission.userId
  );

  // Mark submission as approved
  await pool.query(
    'UPDATE submissions SET status = $1, updated_at = $2 WHERE id = $3',
    ['approved', now, submissionId]
  );

  // Increment user's trust score
  await pool.query('UPDATE users SET trust_score = trust_score + 1, updated_at = $1 WHERE id = $2', [now, submission.userId]);
}

export async function rejectSubmission(submissionId: string, reason: string): Promise<void> {
  const now = new Date();
  await pool.query(
    'UPDATE submissions SET status = $1, rejection_reason = $2, updated_at = $3 WHERE id = $4',
    ['rejected', reason, now, submissionId]
  );
}

export async function getUserTrustScore(userId: string): Promise<number> {
  const result = await pool.query('SELECT trust_score FROM users WHERE id = $1', [userId]);
  const row = result.rows[0] as { trust_score: number } | undefined;
  return row?.trust_score ?? 0;
}
