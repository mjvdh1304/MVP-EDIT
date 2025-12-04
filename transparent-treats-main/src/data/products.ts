export interface Ingredient {
  id: number;
  name: string;
  percentage: number;
  origin: string;
  description: string;
  healthImpact: "high" | "medium" | "low" | "neutral";
  ecoImpact: "high" | "medium" | "low" | "neutral";
  allergens: string[];
  processing: string;
  alternatives: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: string;
  origin: string;
  healthScore: number;
  ecoScore: number;
  ingredients: Ingredient[];
}

export const products: Product[] = [
  {
    id: "organic-bread",
    name: "Organic Whole Grain Bread",
    brand: "EcoChoice Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    category: "Bakery",
    origin: "Netherlands",
    healthScore: 85,
    ecoScore: 92,
    ingredients: [
      {
        id: 1,
        name: "Whole Wheat Flour",
        percentage: 65,
        origin: "Germany",
        description: "Ground from whole wheat grains, retaining all nutritional components including bran and germ.",
        healthImpact: "high",
        ecoImpact: "medium",
        allergens: ["Gluten"],
        processing: "Stone-ground to preserve nutrients",
        alternatives: ["Spelt flour", "Rye flour"]
      },
      {
        id: 2,
        name: "Water",
        percentage: 20,
        origin: "Local source",
        description: "Filtered water used in the dough preparation.",
        healthImpact: "neutral",
        ecoImpact: "high",
        allergens: [],
        processing: "Filtered",
        alternatives: []
      },
      {
        id: 3,
        name: "Sunflower Seeds",
        percentage: 8,
        origin: "France",
        description: "Rich in vitamin E and healthy fats, adds texture and nutritional value.",
        healthImpact: "high",
        ecoImpact: "high",
        allergens: [],
        processing: "Raw, unprocessed",
        alternatives: ["Pumpkin seeds", "Sesame seeds"]
      },
      {
        id: 4,
        name: "Sea Salt",
        percentage: 2,
        origin: "Atlantic Ocean",
        description: "Natural sea salt for flavor enhancement.",
        healthImpact: "medium",
        ecoImpact: "high",
        allergens: [],
        processing: "Solar evaporation",
        alternatives: ["Himalayan salt", "Low-sodium salt"]
      },
      {
        id: 5,
        name: "Baker's Yeast",
        percentage: 3,
        origin: "Belgium",
        description: "Natural leavening agent that helps bread rise.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Cultured",
        alternatives: ["Sourdough starter"]
      },
      {
        id: 6,
        name: "Olive Oil",
        percentage: 2,
        origin: "Spain",
        description: "Extra virgin olive oil for moisture and healthy fats.",
        healthImpact: "high",
        ecoImpact: "medium",
        allergens: [],
        processing: "Cold-pressed",
        alternatives: ["Sunflower oil", "Rapeseed oil"]
      }
    ]
  },
  {
    id: "fresh-orange-juice",
    name: "Fresh Pressed Orange Juice",
    brand: "PureVita",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
    category: "Beverages",
    origin: "Spain",
    healthScore: 92,
    ecoScore: 78,
    ingredients: [
      {
        id: 1,
        name: "Fresh Orange Juice",
        percentage: 99.8,
        origin: "Valencia, Spain",
        description: "Cold-pressed juice from Valencia oranges, known for their sweetness and high vitamin C content.",
        healthImpact: "high",
        ecoImpact: "medium",
        allergens: [],
        processing: "Cold-pressed within 24 hours of harvest",
        alternatives: ["Blood orange juice", "Mandarin juice"]
      },
      {
        id: 2,
        name: "Ascorbic Acid (Vitamin C)",
        percentage: 0.2,
        origin: "EU",
        description: "Added vitamin C to preserve freshness and boost nutritional value. E-number: E300.",
        healthImpact: "high",
        ecoImpact: "medium",
        allergens: [],
        processing: "Synthesized from natural sources",
        alternatives: ["Natural preservation only"]
      }
    ]
  },
  {
    id: "dark-chocolate-bar",
    name: "70% Dark Chocolate Bar",
    brand: "CocoaPure",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4cda6990?w=800&q=80",
    category: "Confectionery",
    origin: "Belgium",
    healthScore: 73,
    ecoScore: 68,
    ingredients: [
      {
        id: 1,
        name: "Cocoa Mass",
        percentage: 52,
        origin: "Ecuador",
        description: "Pure cocoa from organic farms in Ecuador, rich in antioxidants and flavonoids.",
        healthImpact: "high",
        ecoImpact: "medium",
        allergens: [],
        processing: "Fermented and roasted",
        alternatives: ["Peruvian cocoa", "Ghana cocoa"]
      },
      {
        id: 2,
        name: "Cane Sugar",
        percentage: 27,
        origin: "Costa Rica",
        description: "Organic cane sugar, less refined than white sugar, retaining some minerals.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Minimally refined",
        alternatives: ["Coconut sugar", "Stevia"]
      },
      {
        id: 3,
        name: "Cocoa Butter",
        percentage: 18,
        origin: "Ecuador",
        description: "Natural fat extracted from cocoa beans, provides smooth texture and stability.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Cold-pressed",
        alternatives: ["Shea butter"]
      },
      {
        id: 4,
        name: "Vanilla Extract",
        percentage: 2,
        origin: "Madagascar",
        description: "Natural vanilla from Madagascar, one of the world's finest vanilla sources.",
        healthImpact: "neutral",
        ecoImpact: "low",
        allergens: [],
        processing: "Extracted from vanilla pods",
        alternatives: ["Bourbon vanilla", "Tahitian vanilla"]
      },
      {
        id: 5,
        name: "Soy Lecithin",
        percentage: 1,
        origin: "EU",
        description: "Emulsifier derived from soybeans, helps blend ingredients smoothly. E-number: E322.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: ["Soy"],
        processing: "Extracted from soybeans",
        alternatives: ["Sunflower lecithin"]
      }
    ]
  },
  {
    id: "cola-classic",
    name: "Classic Cola",
    brand: "RefreshCo",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80",
    category: "Beverages",
    origin: "USA",
    healthScore: 32,
    ecoScore: 45,
    ingredients: [
      {
        id: 1,
        name: "Carbonated Water",
        percentage: 87,
        origin: "Local source",
        description: "Water infused with carbon dioxide under pressure to create carbonation.",
        healthImpact: "neutral",
        ecoImpact: "medium",
        allergens: [],
        processing: "Carbonated under pressure",
        alternatives: ["Still water", "Sparkling mineral water"]
      },
      {
        id: 2,
        name: "High Fructose Corn Syrup",
        percentage: 10,
        origin: "USA",
        description: "Sweetener derived from corn starch, high in fructose content. Linked to obesity and metabolic issues when consumed in excess.",
        healthImpact: "low",
        ecoImpact: "low",
        allergens: [],
        processing: "Enzymatically processed from corn",
        alternatives: ["Cane sugar", "Stevia", "Natural fruit juice"]
      },
      {
        id: 3,
        name: "Caramel Color",
        percentage: 1,
        origin: "EU",
        description: "Artificial coloring made by heating sugars. E-number: E150d. Some variants may contain 4-MEI, a potential carcinogen.",
        healthImpact: "low",
        ecoImpact: "medium",
        allergens: [],
        processing: "Heat-treated with ammonia compounds",
        alternatives: ["Natural caramel", "No coloring"]
      },
      {
        id: 4,
        name: "Phosphoric Acid",
        percentage: 0.5,
        origin: "USA",
        description: "Acidifier that provides tangy taste. E-number: E338. May affect calcium absorption and bone health.",
        healthImpact: "low",
        ecoImpact: "medium",
        allergens: [],
        processing: "Chemically synthesized",
        alternatives: ["Citric acid", "Natural acids"]
      },
      {
        id: 5,
        name: "Natural Flavors",
        percentage: 1,
        origin: "Various",
        description: "Proprietary blend of natural flavor compounds. Exact composition is trade secret.",
        healthImpact: "neutral",
        ecoImpact: "medium",
        allergens: [],
        processing: "Extracted from natural sources",
        alternatives: ["Specific named flavors", "No artificial flavoring"]
      },
      {
        id: 6,
        name: "Caffeine",
        percentage: 0.5,
        origin: "Synthetic",
        description: "Stimulant compound. Approximately 34mg per 355ml can. Can cause dependency and sleep disruption.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Synthetically produced",
        alternatives: ["Decaffeinated version", "Natural caffeine from tea"]
      }
    ]
  },
  {
    id: "curry-pasta-ready",
    name: "Curry Pasta Ready Meal",
    brand: "QuickEats",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    category: "Ready Meals",
    origin: "Germany",
    healthScore: 58,
    ecoScore: 52,
    ingredients: [
      {
        id: 1,
        name: "Cooked Pasta",
        percentage: 45,
        origin: "Italy",
        description: "Pre-cooked wheat pasta (durum wheat semolina and water).",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: ["Gluten"],
        processing: "Cooked and cooled",
        alternatives: ["Whole wheat pasta", "Chickpea pasta", "Rice noodles"]
      },
      {
        id: 2,
        name: "Curry Sauce",
        percentage: 30,
        origin: "Netherlands",
        description: "Sauce made with tomatoes, onions, curry spices, and vegetable oil.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Cooked and pasteurized",
        alternatives: ["Homemade curry sauce"]
      },
      {
        id: 3,
        name: "Chicken Pieces",
        percentage: 15,
        origin: "Netherlands",
        description: "Cooked chicken breast pieces. Source of lean protein.",
        healthImpact: "high",
        ecoImpact: "low",
        allergens: [],
        processing: "Cooked and diced",
        alternatives: ["Tofu", "Chickpeas", "Turkey"]
      },
      {
        id: 4,
        name: "Vegetables (Bell Pepper, Peas)",
        percentage: 8,
        origin: "Spain/Netherlands",
        description: "Mix of red bell peppers and green peas, providing vitamins and fiber.",
        healthImpact: "high",
        ecoImpact: "high",
        allergens: [],
        processing: "Blanched",
        alternatives: ["Other seasonal vegetables"]
      },
      {
        id: 5,
        name: "Modified Starch",
        percentage: 1.5,
        origin: "EU",
        description: "Thickening agent derived from corn or potato starch. E-number: E1442. Used to improve texture and stability.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Chemically modified",
        alternatives: ["Cornstarch", "Arrowroot powder"]
      },
      {
        id: 6,
        name: "Salt & Spices",
        percentage: 0.5,
        origin: "Various",
        description: "Blend of salt, curry powder, turmeric, cumin, and other spices for flavor.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Ground and mixed",
        alternatives: ["Reduced sodium blend", "Fresh spices"]
      }
    ]
  },
  {
    id: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    brand: "BakeMasters",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80",
    category: "Bakery",
    origin: "Belgium",
    healthScore: 42,
    ecoScore: 58,
    ingredients: [
      {
        id: 1,
        name: "Wheat Flour",
        percentage: 38,
        origin: "France",
        description: "Refined wheat flour, main structural ingredient. Lower in fiber than whole wheat.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: ["Gluten"],
        processing: "Refined and bleached",
        alternatives: ["Whole wheat flour", "Almond flour", "Oat flour"]
      },
      {
        id: 2,
        name: "Sugar",
        percentage: 22,
        origin: "EU",
        description: "Refined white sugar for sweetness. High consumption linked to obesity and diabetes.",
        healthImpact: "low",
        ecoImpact: "medium",
        allergens: [],
        processing: "Refined from sugar beets",
        alternatives: ["Coconut sugar", "Honey", "Date syrup"]
      },
      {
        id: 3,
        name: "Vegetable Oil (Palm)",
        percentage: 18,
        origin: "Malaysia",
        description: "Palm oil used for texture and shelf life. High in saturated fat. Palm cultivation linked to deforestation.",
        healthImpact: "low",
        ecoImpact: "low",
        allergens: [],
        processing: "Refined and hydrogenated",
        alternatives: ["Butter", "Coconut oil", "Sustainable palm oil"]
      },
      {
        id: 4,
        name: "Chocolate Chips",
        percentage: 15,
        origin: "Belgium",
        description: "Semi-sweet chocolate chips (sugar, cocoa mass, cocoa butter, emulsifiers).",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: ["May contain milk", "Soy"],
        processing: "Molded from chocolate",
        alternatives: ["Dark chocolate chips", "Cacao nibs"]
      },
      {
        id: 5,
        name: "Eggs",
        percentage: 4,
        origin: "Netherlands",
        description: "Whole eggs providing structure and richness. Source of protein and vitamins.",
        healthImpact: "high",
        ecoImpact: "medium",
        allergens: ["Eggs"],
        processing: "Pasteurized",
        alternatives: ["Flax eggs", "Applesauce"]
      },
      {
        id: 6,
        name: "Raising Agents & Salt",
        percentage: 2,
        origin: "EU",
        description: "Sodium bicarbonate (E500) and salt for leavening and flavor enhancement.",
        healthImpact: "medium",
        ecoImpact: "high",
        allergens: [],
        processing: "Chemically processed",
        alternatives: ["Baking powder only"]
      },
      {
        id: 7,
        name: "Artificial Vanilla Flavor",
        percentage: 1,
        origin: "EU",
        description: "Synthetic vanillin for vanilla taste. E-number: Not specified. Less complex than natural vanilla.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Synthetically produced",
        alternatives: ["Natural vanilla extract", "Vanilla beans"]
      }
    ]
  },
  {
    id: "cheddar-cheese-slices",
    name: "Cheddar Cheese Slices",
    brand: "DairyFresh",
    image: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&q=80",
    category: "Dairy",
    origin: "Ireland",
    healthScore: 64,
    ecoScore: 48,
    ingredients: [
      {
        id: 1,
        name: "Cheddar Cheese",
        percentage: 75,
        origin: "Ireland",
        description: "Aged cheddar cheese made from cow's milk. Rich in protein and calcium but high in saturated fat.",
        healthImpact: "medium",
        ecoImpact: "low",
        allergens: ["Milk", "Lactose"],
        processing: "Aged and sliced",
        alternatives: ["Plant-based cheese", "Reduced-fat cheddar"]
      },
      {
        id: 2,
        name: "Water",
        percentage: 10,
        origin: "Local source",
        description: "Added water to adjust moisture content and texture of processed cheese slices.",
        healthImpact: "neutral",
        ecoImpact: "high",
        allergens: [],
        processing: "Filtered",
        alternatives: []
      },
      {
        id: 3,
        name: "Milk Proteins",
        percentage: 6,
        origin: "Ireland",
        description: "Concentrated milk proteins to enhance protein content and improve melting properties.",
        healthImpact: "high",
        ecoImpact: "medium",
        allergens: ["Milk"],
        processing: "Extracted and concentrated",
        alternatives: ["Casein-free proteins for lactose intolerant"]
      },
      {
        id: 4,
        name: "Emulsifying Salts",
        percentage: 4,
        origin: "EU",
        description: "Sodium citrate (E331) and sodium phosphate (E339) to improve texture and prevent separation.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Chemically synthesized",
        alternatives: ["Natural cheese without additives"]
      },
      {
        id: 5,
        name: "Modified Starch",
        percentage: 3,
        origin: "EU",
        description: "Acts as stabilizer and thickener. E-number: E1442. Prevents cheese from sticking.",
        healthImpact: "medium",
        ecoImpact: "medium",
        allergens: [],
        processing: "Chemically modified from corn",
        alternatives: ["Potato starch", "No starch version"]
      },
      {
        id: 6,
        name: "Salt",
        percentage: 1.5,
        origin: "Various",
        description: "For flavor and preservation. Contains approximately 1.5g sodium per 100g.",
        healthImpact: "medium",
        ecoImpact: "high",
        allergens: [],
        processing: "Refined",
        alternatives: ["Reduced sodium version"]
      },
      {
        id: 7,
        name: "Natural Color (Annatto)",
        percentage: 0.5,
        origin: "South America",
        description: "Natural orange-yellow color from annatto seeds. E-number: E160b. Generally safe.",
        healthImpact: "neutral",
        ecoImpact: "high",
        allergens: [],
        processing: "Extracted from seeds",
        alternatives: ["No coloring", "Beta-carotene"]
      }
    ]
  }
];
