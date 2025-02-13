import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plan } from "@shared/schema";
import { getAIRecommendations } from "@/lib/azure-ai";
import { Lightbulb, Shield, DollarSign } from "lucide-react";

interface AIRecommendationsProps {
  plan: Plan;
}

export function AIRecommendations({ plan }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAIRecommendations(plan)
      .then(setRecommendations)
      .finally(() => setLoading(false));
  }, [plan]);

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-20" />
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return <Lightbulb className="h-4 w-4 text-primary" />;
      case "security":
        return <Shield className="h-4 w-4 text-primary" />;
      case "cost":
        return <DollarSign className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 opacity-20">
        <img 
          src="/assets/ai-assistant.png" 
          alt="" 
          className="h-full w-full object-contain"
        />
      </div>
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-primary/90 to-primary text-transparent bg-clip-text">
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start space-x-3 text-sm rounded-lg p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">{getIcon(rec.type)}</div>
              <div>
                <p className="font-medium">{rec.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Confidence: {Math.round(rec.confidence * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}