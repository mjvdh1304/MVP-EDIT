# API Integration Guide

This document describes how the frontend connects to the backend API for product lookup, ingredient analysis, user profiles, and scoring.

## Architecture

The app uses a **layered adapter pattern** with **safe local fallbacks**:

```
UI Components (Products.tsx, ProductDemo.tsx, IngredientModal.tsx)
         ↓
   React Query hooks (useQuery)
         ↓
   API Adapter (src/services/api.ts)
         ↓
   Remote API OR Local Data (src/data/products.ts)
```

- **Remote API** is called only when `VITE_USE_REMOTE_API=true` and `VITE_API_BASE_URL` is set.
- **Local fallback** uses `src/data/products.ts` when remote is disabled or network fails.
- **UI remains unchanged** whether data comes from remote or local source.

## Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Disable remote API (default):
VITE_USE_REMOTE_API=false
VITE_API_BASE_URL=

# Enable remote API:
VITE_USE_REMOTE_API=true
VITE_API_BASE_URL=https://api.example.com
```

### Development

```bash
# Run with local data (default)
npm run dev

# Run with remote API enabled (needs backend server at localhost:3001)
VITE_USE_REMOTE_API=true VITE_API_BASE_URL=http://localhost:3001 npm run dev
```

## API Functions

The adapter exports these functions in `src/services/api.ts`:

### `getAllProducts(): Promise<Product[]>`
Get all products. Falls back to local data if remote fails.

```ts
import api from "@/services/api";
const products = await api.getAllProducts();
```

### `getProductById(id: string): Promise<Product | undefined>`
Fetch a single product by ID.

```ts
const product = await api.getProductById("organic-bread");
```

### `analyzeIngredients(productId, ingredients, userProfileId?): Promise<AnalysisResponse>`
Analyze a list of ingredients and return per-ingredient scores, explanations, and sourcing data.

```ts
const analysis = await api.analyzeIngredients("organic-bread", product.ingredients, "user_123");
```

Returns:
```ts
{
  productId?: string;
  ingredients: [
    {
      id: number;
      name: string;
      healthScore: number;      // 0-100
      ecoScore: number;         // 0-100
      explanation?: string;
      sourcing?: {
        origin?: string;
        certifications?: string[];
        sustainabilityNotes?: string;
      };
    }
  ];
  aggregateScores: { health: number; eco: number };
  generatedAt: string;
}
```

### `getUserProfile(): Promise<UserProfile | null>`
Fetch the authenticated user's profile (remote only).

```ts
const profile = await api.getUserProfile();
// Returns { id, name, preferences, conditions, settings } or null
```

## Integration Points

### Products Page (`src/pages/Products.tsx`)

Uses React Query to fetch products with automatic caching:

```ts
const { data: products = [], isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: api.getAllProducts,
});
```

### Product Detail Page (`src/pages/ProductDemo.tsx`)

Fetches a single product by route parameter:

```ts
const { data: product, isLoading } = useQuery({
  queryKey: ["product", productId],
  queryFn: () => productId ? api.getProductById(productId) : undefined,
  enabled: !!productId,
});
```

### Ingredient Modal (`src/components/IngredientModal.tsx`)

Optionally fetches ingredient analysis when modal opens (if productId provided):

```ts
const { data: analysis } = useQuery({
  queryKey: ["ingredient-analysis", productId, ingredient.id],
  queryFn: () =>
    productId
      ? api.analyzeIngredients(productId, [ingredient])
      : Promise.resolve(null),
  enabled: !!productId,
});
```

Displays analysis scores alongside static ingredient data.

## Error Handling & Resilience

- All API calls have an **8-second timeout** to prevent hangs.
- Network errors are caught and silently fall back to local data.
- React Query handles retries and caching automatically.
- UI components remain fully functional with local fallback.

## Backend Specification

For the API server implementation, refer to the OpenAPI contract in `openapi.yml` (or `docs/api.yaml`).

### Required Endpoints

1. **GET /api/product/:id** — Return product details (see schema in openapi.yml)
2. **GET /api/products** — Return array of products (optional)
3. **POST /api/ingredients/analyze** — Analyze ingredient list
4. **GET /api/user/profile** — Get user profile (authenticated)

### Minimal Response Shapes

**Product:**
```json
{
  "id": "organic-bread",
  "name": "Organic Whole Grain Bread",
  "brand": "EcoChoice Bakery",
  "category": "Bakery",
  "origin": "Netherlands",
  "healthScore": 85,
  "ecoScore": 92,
  "image": "https://...",
  "ingredients": [
    {
      "id": 1,
      "name": "Whole Wheat Flour",
      "percentage": 65,
      "origin": "Germany",
      "description": "...",
      "healthImpact": "high",
      "ecoImpact": "medium",
      "allergens": ["Gluten"],
      "processing": "...",
      "alternatives": ["Spelt flour"]
    }
  ]
}
```

**Analysis Request:**
```json
{
  "productId": "organic-bread",
  "ingredients": [...],
  "userProfileId": "user_123"
}
```

**Analysis Response:**
```json
{
  "productId": "organic-bread",
  "ingredients": [
    {
      "id": 1,
      "name": "Whole Wheat Flour",
      "healthScore": 85,
      "ecoScore": 70,
      "explanation": "Stone-ground preserves nutrients...",
      "sourcing": {
        "origin": "Germany",
        "certifications": ["organic"],
        "sustainabilityNotes": "..."
      }
    }
  ],
  "aggregateScores": { "health": 85, "eco": 90 },
  "generatedAt": "2025-12-04T..."
}
```

## Testing & Mocking

To test without a backend server, use Mock Service Worker (MSW). See `dev mocks & tests` todo for implementation steps.

## Rollout & Monitoring

1. **Phase 1** (current): `VITE_USE_REMOTE_API=false` in production — app uses local data.
2. **Phase 2**: Backend ready — set `VITE_USE_REMOTE_API=true` for a small % of users, monitor errors.
3. **Phase 3**: Gradual rollout to full traffic once confidence is high.

Track:
- API latency (query time)
- Error rate (failed requests)
- Cache hit ratio (React Query)
- User engagement (did analysis feature increase product detail views?)

## Examples

### Fetch products in a new component

```ts
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

function MyComponent() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: api.getAllProducts,
  });

  return (
    <ul>
      {products?.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

### Call analyze ingredients directly (no component)

```ts
import api from "@/services/api";

const analysis = await api.analyzeIngredients(
  "organic-bread",
  [{ id: 1, name: "Whole Wheat Flour", ... }],
  "user_123"
);
console.log(analysis.aggregateScores); // { health: 85, eco: 90 }
```

## Next Steps

- Implement backend API service (Node/Express or serverless).
- Add MSW mocks for local development testing.
- Add unit tests for adapter fallback behavior.
- Implement user authentication & profile endpoints.
- Deploy to production with Phase 1 configuration (remote disabled).
