import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Leaf, AlertCircle } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import IngredientCard from "@/components/IngredientCard";
import ImpactScore from "@/components/ImpactScore";
import IngredientModal from "@/components/IngredientModal";
import { products } from "@/data/products";
import type { Ingredient } from "@/data/products";

const ProductDemo = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find(p => p.id === productId);
  
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  // Redirect if product not found
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Product Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-4xl font-bold text-foreground mb-3">{product.name}</h1>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.origin}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ImpactScore 
                title="Health Score" 
                score={product.healthScore} 
                type="health"
              />
              <ImpactScore 
                title="Eco Score" 
                score={product.ecoScore} 
                type="eco"
              />
            </div>

            <Card className="p-4 bg-accent/50 border-accent">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Transparency Highlights
                  </p>
                  <p className="text-muted-foreground">
                    All ingredients are fully traceable from origin to product. 
                    Sourced from verified suppliers with complete supply chain visibility.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Ingredients Breakdown</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onClick={() => setSelectedIngredient(ingredient)}
              />
            ))}
          </div>
        </div>

        {/* Supply Chain Visualization */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Supply Chain Journey</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Sourcing</h3>
              <p className="text-sm text-muted-foreground">
                Ingredients from verified suppliers
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Processing</h3>
              <p className="text-sm text-muted-foreground">
                Quality-controlled preparation
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Production</h3>
              <p className="text-sm text-muted-foreground">
                Manufacturing in {product.origin}
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Regional distribution network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <IngredientModal
          ingredient={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
        />
      )}
    </div>
  );
};

export default ProductDemo;
