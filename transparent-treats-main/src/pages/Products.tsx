import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, QrCode, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import ImpactScore from "@/components/ImpactScore";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Demo Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our demo products to see how the QR transparency platform works. 
            Click on any product to view its complete ingredient breakdown.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id}
              className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.origin}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Health</p>
                      <p className="text-2xl font-bold text-primary">{product.healthScore}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Eco</p>
                      <p className="text-2xl font-bold text-primary">{product.ecoScore}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <QrCode className="w-4 h-4" />
                    <span>{product.ingredients.length} ingredients tracked</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 bg-accent/50 border-accent max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Ready to Add Your Products?
            </h3>
            <p className="text-muted-foreground mb-4">
              If you're a producer interested in participating in our transparency pilot program, 
              we'd love to hear from you.
            </p>
            <Button size="lg">
              Contact Us
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Products;
