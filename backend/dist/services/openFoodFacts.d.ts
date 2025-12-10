/**
 * Open Food Facts API Integration
 *
 * Fetches product information from the Open Food Facts database
 * https://world.openfoodfacts.org/
 */
export interface NormalizedProduct {
    barcode: string;
    name: string;
    brand?: string;
    category?: string;
    ingredients: Array<{
        id: number;
        name: string;
        allergen?: boolean;
        origin?: string;
    }>;
    certifications: string[];
    nutritionFacts: {
        calories?: number;
        fat?: string;
        saturatedFat?: string;
        carbohydrates?: string;
        sugars?: string;
        fiber?: string;
        protein?: string;
        salt?: string;
        sodium?: string;
    };
    allergens?: string[];
    nutriScore?: string;
    ecoScore?: string;
    source: 'openfoodfacts';
}
/**
 * Fetch product by barcode from Open Food Facts
 */
export declare function fetchProductByBarcode(barcode: string): Promise<NormalizedProduct | null>;
//# sourceMappingURL=openFoodFacts.d.ts.map