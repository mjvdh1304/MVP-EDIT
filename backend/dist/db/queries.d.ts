import type { User, Product, Submission } from '../types/index.js';
export declare function getUserByEmail(email: string): Promise<User | null>;
export declare function getUserById(id: string): Promise<User | null>;
export declare function createUser(email: string, name: string, password: string): Promise<User>;
export declare function createProduct(barcode: string, name: string, brand: string | undefined, category: string | undefined, ingredients: unknown, certifications: string[], nutritionFacts: unknown | undefined, submittedBy: string): Promise<Product>;
export declare function getProductById(id: string): Promise<Product | null>;
export declare function getProductByBarcode(barcode: string): Promise<Product | null>;
export declare function getAllProducts(): Promise<Product[]>;
export declare function createSubmission(userId: string, barcode: string, name: string, brand: string | undefined, category: string | undefined, ingredients: unknown, certifications: string[], nutritionFacts: unknown | undefined, sourceUrl: string | undefined, notes: string | undefined, status: string): Promise<Submission>;
export declare function getSubmissionById(id: string): Promise<Submission | null>;
export declare function getUserSubmissions(userId: string): Promise<Submission[]>;
export declare function getPendingSubmissions(limit?: number, offset?: number): Promise<Submission[]>;
export declare function approveSubmission(submissionId: string, adminId: string): Promise<void>;
export declare function rejectSubmission(submissionId: string, reason: string): Promise<void>;
export declare function getUserTrustScore(userId: string): Promise<number>;
//# sourceMappingURL=queries.d.ts.map