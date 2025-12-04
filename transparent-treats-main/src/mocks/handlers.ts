/*
 * MSW (Mock Service Worker) handlers for development.
 * These handlers intercept fetch requests and return mock responses.
 * Used for local testing without a running backend.
 */
import { http, HttpResponse } from "msw";
import { products } from "@/data/products";
import type { Product, Ingredient } from "@/data/products";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const handlers = [
  // GET /api/product/:id
  http.get(`${API_BASE}/api/product/:id`, ({ params }) => {
    const { id } = params;
    const product = products.find((p) => p.id === id);
    if (!product) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(product);
  }),

  // GET /api/products (list all)
  http.get(`${API_BASE}/api/products`, () => {
    return HttpResponse.json(products);
  }),

  // POST /api/ingredients/analyze
  http.post(`${API_BASE}/api/ingredients/analyze`, async ({ request }) => {
    const body = await request.json() as {
      productId?: string;
      ingredients?: Ingredient[];
      userProfileId?: string;
    };

    const { productId, ingredients = [], userProfileId } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return HttpResponse.json(
        { message: "Invalid ingredients array" },
        { status: 400 }
      );
    }

    // Mock analysis: compute heuristic scores based on ingredient impact levels
    const analysisIngredients = ingredients.map((ing) => {
      const healthScore = ing.healthImpact === "high" ? 85 : ing.healthImpact === "medium" ? 65 : ing.healthImpact === "low" ? 40 : 60;
      const ecoScore = ing.ecoImpact === "high" ? 80 : ing.ecoImpact === "medium" ? 60 : ing.ecoImpact === "low" ? 35 : 55;
      return {
        id: ing.id,
        name: ing.name,
        healthScore,
        ecoScore,
        explanation: `${ing.name} is a ${ing.healthImpact} health impact ingredient. ${ing.description || ""}`,
        sourcing: {
          origin: ing.origin,
          certifications: ing.healthImpact === "high" ? ["organic"] : [],
          sustainabilityNotes: ing.ecoImpact === "high" ? "Sustainably sourced with low environmental impact." : "Standard sourcing practices.",
        },
      };
    });

    const aggregateScores = {
      health: Math.round(analysisIngredients.reduce((s, i) => s + i.healthScore, 0) / Math.max(1, analysisIngredients.length)),
      eco: Math.round(analysisIngredients.reduce((s, i) => s + i.ecoScore, 0) / Math.max(1, analysisIngredients.length)),
    };

    return HttpResponse.json({
      productId,
      ingredients: analysisIngredients,
      aggregateScores,
      generatedAt: new Date().toISOString(),
      metadata: {
        source: "mock",
        userProfileId,
      },
    });
  }),

  // GET /api/user/profile (authenticated, returns mock user)
  http.get(`${API_BASE}/api/user/profile`, () => {
    return HttpResponse.json({
      id: "user_demo_001",
      name: "Demo User",
      preferences: {
        avoid: [],
        focus: ["organic", "low-sugar"],
      },
      conditions: [],
      settings: {
        personalization: true,
      },
    });
  }),

  // POST /api/score (combined scoring endpoint)
  http.post(`${API_BASE}/api/score`, async ({ request }) => {
    const body = await request.json() as {
      productId?: string;
      userProfileId?: string;
    };

    const { productId, userProfileId } = body;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Return a mock scoring response
    return HttpResponse.json({
      productId,
      ingredients: product.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        healthScore: product.healthScore,
        ecoScore: product.ecoScore,
        explanation: ing.description,
        sourcing: { origin: ing.origin },
      })),
      aggregateScores: {
        health: product.healthScore,
        eco: product.ecoScore,
      },
      generatedAt: new Date().toISOString(),
      personalizedForUser: userProfileId || null,
    });
  }),

  // GET /api/health (health check)
  http.get(`${API_BASE}/api/health`, () => {
    return HttpResponse.json({ status: "ok", source: "mock" });
  }),
];
