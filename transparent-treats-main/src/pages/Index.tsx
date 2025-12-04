import { Button } from "@/components/ui/button";
import { QrCode, Leaf, Shield, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <Leaf className="w-4 h-4" />
              Transparency for every product
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Know What You're
              <span className="block text-primary">Really Eating</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scan any QR code to discover the complete story behind your food: 
              ingredients, origins, health impacts, and environmental footprint.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/products">
                  <QrCode className="w-5 h-5 mr-2" />
                  View Demo Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/products">Browse Catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Complete Product Transparency
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Ingredient Deep Dive</h3>
              <p className="text-muted-foreground">
                Understand every ingredient, E-number, and additive with simple explanations and health impact ratings.
              </p>
            </div>

            <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Origin Tracking</h3>
              <p className="text-muted-foreground">
                Trace where each ingredient comes from and discover the complete supply chain journey.
              </p>
            </div>

            <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Impact Scores</h3>
              <p className="text-muted-foreground">
                Get clear health and environmental ratings based on independent research and data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Scan the QR Code</h3>
                <p className="text-muted-foreground">
                  Every participating product has a unique QR code on its packaging.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Explore the Details</h3>
                <p className="text-muted-foreground">
                  Access comprehensive information about ingredients, origins, and impacts.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Make Informed Choices</h3>
                <p className="text-muted-foreground">
                  Use the insights to choose products that align with your values and health goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to See It in Action?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Explore our demo products to experience the full transparency platform.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link to="/products">
              <QrCode className="w-5 h-5 mr-2" />
              View Demo Products
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
