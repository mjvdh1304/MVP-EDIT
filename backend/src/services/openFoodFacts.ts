/**
 * Open Food Facts API Integration
 * 
 * Fetches product information from the Open Food Facts database
 * https://world.openfoodfacts.org/
 */

interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  ingredients_text?: string;
  ingredients?: Array<{
    id: string;
    text: string;
    vegan?: string;
    vegetarian?: string;
  }>;
  labels?: string;
  nutriments?: {
    energy_100g?: number;
    'energy-kcal_100g'?: number;
    fat_100g?: number;
    'saturated-fat_100g'?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
  };
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  allergens?: string;
  traces?: string;
}

interface OpenFoodFactsResponse {
  status: number;
  status_verbose: string;
  product?: OpenFoodFactsProduct;
}

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
export async function fetchProductByBarcode(barcode: string): Promise<NormalizedProduct | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': 'TransparentTreats/1.0 (Contact: admin@transparenttreats.com)',
        },
      }
    );

    if (!response.ok) {
      console.error(`Open Food Facts API error: ${response.status}`);
      return null;
    }

    const data = await response.json() as OpenFoodFactsResponse;

    if (data.status !== 1 || !data.product) {
      return null; // Product not found
    }

    return normalizeProduct(data.product);
  } catch (error) {
    console.error('Error fetching from Open Food Facts:', error);
    return null;
  }
}

/**
 * Normalize Open Food Facts data to our internal format
 */
function normalizeProduct(product: OpenFoodFactsProduct): NormalizedProduct {
  // Parse ingredients
  const ingredients = product.ingredients?.map((ing, idx) => ({
    id: idx + 1,
    name: ing.text || ing.id,
    allergen: false, // We'll parse allergens separately
  })) || [];

  // If no structured ingredients, parse from text
  if (ingredients.length === 0 && product.ingredients_text) {
    const ingredientNames = product.ingredients_text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    ingredients.push(
      ...ingredientNames.map((name, idx) => ({
        id: idx + 1,
        name,
        allergen: false,
      }))
    );
  }

  // Parse certifications from labels
  const certifications: string[] = [];
  if (product.labels) {
    const labels = product.labels.toLowerCase();
    if (labels.includes('organic') || labels.includes('bio')) certifications.push('organic');
    if (labels.includes('vegan')) certifications.push('vegan');
    if (labels.includes('vegetarian')) certifications.push('vegetarian');
    if (labels.includes('gluten-free')) certifications.push('gluten-free');
    if (labels.includes('fair-trade') || labels.includes('fairtrade')) certifications.push('fair-trade');
    if (labels.includes('kosher')) certifications.push('kosher');
    if (labels.includes('halal')) certifications.push('halal');
  }

  // Parse allergens
  const allergens: string[] = [];
  if (product.allergens) {
    allergens.push(...product.allergens.split(',').map((a) => a.trim().replace('en:', '')));
  }
  if (product.traces) {
    allergens.push(...product.traces.split(',').map((a) => `traces of ${a.trim().replace('en:', '')}`));
  }

  // Build nutrition facts
  const nutritionFacts: NormalizedProduct['nutritionFacts'] = {};
  if (product.nutriments) {
    const n = product.nutriments;
    nutritionFacts.calories = n['energy-kcal_100g'] || (n.energy_100g ? Math.round(n.energy_100g / 4.184) : undefined);
    nutritionFacts.fat = n.fat_100g ? `${n.fat_100g}g` : undefined;
    nutritionFacts.saturatedFat = n['saturated-fat_100g'] ? `${n['saturated-fat_100g']}g` : undefined;
    nutritionFacts.carbohydrates = n.carbohydrates_100g ? `${n.carbohydrates_100g}g` : undefined;
    nutritionFacts.sugars = n.sugars_100g ? `${n.sugars_100g}g` : undefined;
    nutritionFacts.fiber = n.fiber_100g ? `${n.fiber_100g}g` : undefined;
    nutritionFacts.protein = n.proteins_100g ? `${n.proteins_100g}g` : undefined;
    nutritionFacts.salt = n.salt_100g ? `${n.salt_100g}g` : undefined;
    nutritionFacts.sodium = n.sodium_100g ? `${n.sodium_100g}g` : undefined;
  }

  return {
    barcode: product.code,
    name: product.product_name || 'Unknown Product',
    brand: product.brands || undefined,
    category: product.categories?.split(',')[0]?.trim() || undefined,
    ingredients,
    certifications,
    nutritionFacts,
    allergens: allergens.length > 0 ? allergens : undefined,
    nutriScore: product.nutriscore_grade?.toUpperCase(),
    ecoScore: product.ecoscore_grade?.toUpperCase(),
    source: 'openfoodfacts',
  };
}
