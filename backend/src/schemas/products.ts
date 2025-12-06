import { z } from 'zod';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name required').max(100).trim(),
  allergen: z.boolean().optional(),
  origin: z.string().max(100).optional(),
  certifications: z.array(z.string()).optional(),
});

export const submitProductSchema = z.object({
  barcode: z.string().min(8, 'Barcode must be at least 8 characters').max(14).trim(),
  name: z.string().min(1, 'Product name required').max(200).trim(),
  brand: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient required'),
  certifications: z.array(z.string()).optional(),
  nutritionFacts: z.record(z.unknown()).optional(),
  sourceUrl: z.string().url('Invalid URL').optional(),
  notes: z.string().max(1000).optional(),
});

export type SubmitProductInput = z.infer<typeof submitProductSchema>;

export const updateProfileSchema = z.object({
  preferences: z.record(z.unknown()).optional(),
  dietaryConditions: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  certificationPreferences: z.array(z.string()).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
