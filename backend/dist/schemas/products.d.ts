import { z } from 'zod';
export declare const submitProductSchema: z.ZodObject<{
    barcode: z.ZodString;
    name: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    ingredients: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        allergen: z.ZodOptional<z.ZodBoolean>;
        origin: z.ZodOptional<z.ZodString>;
        certifications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        certifications?: string[] | undefined;
        allergen?: boolean | undefined;
        origin?: string | undefined;
    }, {
        name: string;
        certifications?: string[] | undefined;
        allergen?: boolean | undefined;
        origin?: string | undefined;
    }>, "many">;
    certifications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    nutritionFacts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    sourceUrl: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    barcode: string;
    ingredients: {
        name: string;
        certifications?: string[] | undefined;
        allergen?: boolean | undefined;
        origin?: string | undefined;
    }[];
    brand?: string | undefined;
    category?: string | undefined;
    certifications?: string[] | undefined;
    nutritionFacts?: Record<string, unknown> | undefined;
    sourceUrl?: string | undefined;
    notes?: string | undefined;
}, {
    name: string;
    barcode: string;
    ingredients: {
        name: string;
        certifications?: string[] | undefined;
        allergen?: boolean | undefined;
        origin?: string | undefined;
    }[];
    brand?: string | undefined;
    category?: string | undefined;
    certifications?: string[] | undefined;
    nutritionFacts?: Record<string, unknown> | undefined;
    sourceUrl?: string | undefined;
    notes?: string | undefined;
}>;
export type SubmitProductInput = z.infer<typeof submitProductSchema>;
export declare const updateProfileSchema: z.ZodObject<{
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    dietaryConditions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    allergens: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    certificationPreferences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    preferences?: Record<string, unknown> | undefined;
    dietaryConditions?: string[] | undefined;
    allergens?: string[] | undefined;
    certificationPreferences?: string[] | undefined;
}, {
    preferences?: Record<string, unknown> | undefined;
    dietaryConditions?: string[] | undefined;
    allergens?: string[] | undefined;
    certificationPreferences?: string[] | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=products.d.ts.map