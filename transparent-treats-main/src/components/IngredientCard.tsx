import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface IngredientCardProps {
  ingredient: {
    name: string;
    percentage: number;
    origin: string;
    healthImpact: string;
    ecoImpact: string;
    allergens: string[];
  };
  onClick: () => void;
}

const IngredientCard = ({ ingredient, onClick }: IngredientCardProps) => {
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "medium":
        return <Minus className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20";
      case "low":
        return "text-red-600 bg-red-50 dark:bg-red-950/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {ingredient.name}
          </h3>
          <span className="text-lg font-bold text-primary">
            {ingredient.percentage}%
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{ingredient.origin}</span>
        </div>

        <div className="flex gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getImpactColor(ingredient.healthImpact)}`}>
            {getImpactIcon(ingredient.healthImpact)}
            <span>Health</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getImpactColor(ingredient.ecoImpact)}`}>
            {getImpactIcon(ingredient.ecoImpact)}
            <span>Eco</span>
          </div>
        </div>

        {ingredient.allergens.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {ingredient.allergens.map((allergen) => (
              <Badge key={allergen} variant="destructive" className="text-xs">
                {allergen}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default IngredientCard;
