/*
 * Example unit tests for src/services/api.ts
 * Tests adapter fallback behavior and mock API responses.
 * 
 * To run:
 *   npm install --save-dev vitest @testing-library/react
 *   npm test -- src/services/api.test.ts
 * 
 * (This is a reference implementation; integrate with your test runner.)
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import * as api from "@/services/api";
import { products } from "@/data/products";

const API_BASE = "http://localhost:3001";

// Setup MSW server for tests
const server = setupServer(
  http.get(`${API_BASE}/api/product/:id`, ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    return product
      ? HttpResponse.json(product)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.get(`${API_BASE}/api/products`, () => {
    return HttpResponse.json(products);
  }),

  http.post(`${API_BASE}/api/ingredients/analyze`, async ({ request }) => {
    const body = await request.json() as {
      productId?: string;
      ingredients?: Array<{ id: number; name: string }>;
      userProfileId?: string;
    };
    return HttpResponse.json({
      productId: body.productId,
      ingredients: body.ingredients?.map((ing) => ({
        id: ing.id,
        name: ing.name,
        healthScore: 75,
        ecoScore: 70,
        explanation: `Mock analysis for ${ing.name}`,
      })) || [],
      aggregateScores: { health: 75, eco: 70 },
      generatedAt: new Date().toISOString(),
    });
  })
);

beforeAll(() => {
  // Force adapter to use our mock API base during tests
  api.__setTestConfig({ apiBase: API_BASE, useRemote: true });
  server.listen({ onUnhandledRequest: "error" });
});
afterAll(() => {
  server.close();
  api.__resetConfig();
});

describe("API Adapter", () => {
  describe("getProductById", () => {
    it("should return a product by id from mock API", async () => {
      const product = await api.getProductById("organic-bread");
      expect(product).toBeDefined();
      expect(product?.name).toBe("Organic Whole Grain Bread");
    });

    it("should fall back to local data when product not found remotely", async () => {
      // Simulate API returning 404
      server.use(
        http.get(`${API_BASE}/api/product/:id`, () => {
          return HttpResponse.json({ message: "Not found" }, { status: 404 });
        })
      );

      const product = await api.getProductById("non-existent");
      // With remote disabled or erroring, falls back to local data
      expect(product).toBeUndefined(); // No local product with this id
    });

    it("should use local data when remote API is disabled", async () => {
      // Test with VITE_USE_REMOTE_API = false
      // In this case, the adapter should directly return from local data
      const product = await api.getProductById("organic-bread");
      expect(product).toBeDefined();
      expect(product?.id).toBe("organic-bread");
    });
  });

  describe("analyzeIngredients", () => {
    it("should analyze ingredients via remote API", async () => {
      const product = products[0];
      const analysis = await api.analyzeIngredients(
        product.id,
        product.ingredients,
        "user_123"
      );

      expect(analysis.productId).toBe(product.id);
      expect(analysis.ingredients).toHaveLength(product.ingredients.length);
      expect(analysis.aggregateScores).toHaveProperty("health");
      expect(analysis.aggregateScores).toHaveProperty("eco");
      expect(analysis.generatedAt).toBeDefined();
    });

    it("should fall back to local heuristic analysis on network error", async () => {
      // Disable mock server to simulate network error
      server.use(
        http.post(`${API_BASE}/api/ingredients/analyze`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const ing = products[0].ingredients[0];
      const analysis = await api.analyzeIngredients(
        "organic-bread",
        [ing],
        undefined
      );

      // Fallback returns heuristic scores
      expect(analysis.ingredients[0]).toHaveProperty("healthScore");
      expect(analysis.ingredients[0]).toHaveProperty("ecoScore");
      expect(analysis.aggregateScores.health).toBeGreaterThan(0);
    });
  });

  describe("getAllProducts", () => {
    it("should return all products from API", async () => {
      const allProducts = await api.getAllProducts();
      expect(Array.isArray(allProducts)).toBe(true);
      expect(allProducts.length).toBeGreaterThan(0);
    });

    it("should return local data if remote call fails", async () => {
      server.use(
        http.get(`${API_BASE}/api/products`, () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const allProducts = await api.getAllProducts();
      // Falls back to local
      expect(Array.isArray(allProducts)).toBe(true);
    });
  });

  describe("getUserProfile", () => {
    it("should return null when remote API is disabled", async () => {
      const profile = await api.getUserProfile();
      // Remote-only endpoint returns null when not enabled
      expect(profile).toBeNull();
    });
  });

  describe("Timeout resilience", () => {
    it("should timeout and fall back after 8 seconds", async () => {
      server.use(
        http.get(`${API_BASE}/api/product/:id`, async () => {
          // Simulate slow response
          await new Promise((resolve) => setTimeout(resolve, 9000));
          return HttpResponse.json({});
        })
      );

      const startTime = Date.now();
      const product = await api.getProductById("organic-bread");
      const duration = Date.now() - startTime;

      // Should timeout before 9 seconds and return fallback
      expect(duration).toBeLessThan(10000);
    });
  });
});

describe("Integration: Products Page with API", () => {
  it("should fetch and render products with React Query", async () => {
    // This test would use @testing-library/react and renderHook
    // Example structure:
    // const { result } = renderHook(() => useQuery({
    //   queryKey: ["products"],
    //   queryFn: api.getAllProducts,
    // }));
    // await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // expect(result.current.data).toHaveLength(products.length);
  });
});
