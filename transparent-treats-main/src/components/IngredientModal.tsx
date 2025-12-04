import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, AlertTriangle, ArrowRight } from "lucide-react";
import api from "@/services/api";

interface IngredientModalProps {
  ingredient: {
    id?: number;
    name: string;
    percentage: number;
    origin: string;
    description: string;
    healthImpact: string;
    ecoImpact: string;
    allergens: string[];
    processing: string;
    alternatives: string[];
  };
  productId?: string;
  onClose: () => void;
}

const IngredientModal = ({ ingredient, productId, onClose }: IngredientModalProps) => {
  // Optional: fetch analysis for this ingredient if productId is provided
  const { data: analysis } = useQuery({
    queryKey: ["ingredient-analysis", productId, ingredient.id],
    queryFn: () =>
      productId
        ? api.analyzeIngredients(productId, [ingredient])
        : Promise.resolve(null),
    enabled: !!productId,
  });

  const analysisData = analysis?.ingredients[0];

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high":
        return { label: "Positive", color: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200" };
      case "medium":
        return { label: "Neutral", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200" };
      case "low":
        return { label: "Concerns", color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200" };
    }
  };

  const healthImpactData = getImpactLabel(ingredient.healthImpact);
  const ecoImpactData = getImpactLabel(ingredient.ecoImpact);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{ingredient.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Origin & Percentage */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{ingredient.origin}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium text-primary">{ingredient.percentage}% of product</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">What is it?</h3>
            <p className="text-muted-foreground">{analysisData?.explanation || ingredient.description}</p>
          </div>

          {/* Processing */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Processing</h3>
              <p className="text-sm text-muted-foreground">{ingredient.processing}</p>
            </div>
          </div>

          {/* Impact Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Health Impact</h3>
              <Badge className={healthImpactData.color}>{healthImpactData.label}</Badge>
              {analysisData?.healthScore !== undefined && (
                <p className="text-xs text-muted-foreground mt-2">Score: {analysisData.healthScore}/100</p>
              )}
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Environmental Impact</h3>
              <Badge className={ecoImpactData.color}>{ecoImpactData.label}</Badge>
              {analysisData?.ecoScore !== undefined && (
                <p className="text-xs text-muted-foreground mt-2">Score: {analysisData.ecoScore}/100</p>
              )}
            </div>
          </div>

          {/* Allergens */}
          {ingredient.allergens.length > 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Allergen Warning</h3>
                  <div className="flex gap-2 flex-wrap">
                    {ingredient.allergens.map((allergen) => (
                      <Badge key={allergen} variant="destructive">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alternatives */}
          {ingredient.alternatives.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Alternative Ingredients
              </h3>
              <div className="flex gap-2 flex-wrap">
                {ingredient.alternatives.map((alt) => (
                  <Badge key={alt} variant="outline" className="text-sm">
                    {alt}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientModal;
