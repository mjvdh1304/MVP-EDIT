import { Card } from "@/components/ui/card";
import { Heart, Leaf } from "lucide-react";

interface ImpactScoreProps {
  title: string;
  score: number;
  type: "health" | "eco";
}

const ImpactScore = ({ title, score, type }: ImpactScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const icon = type === "health" ? <Heart className="w-5 h-5" /> : <Leaf className="w-5 h-5" />;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-sm text-muted-foreground">
          / 100
        </span>
      </div>
      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${getScoreColor(score).replace('text-', 'bg-')} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {getScoreLabel(score)}
      </p>
    </Card>
  );
};

export default ImpactScore;
