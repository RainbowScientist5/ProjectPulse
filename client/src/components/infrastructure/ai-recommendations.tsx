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
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate

-pulse h-20" />
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return <Lightbulb className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "cost":
        return <DollarSign className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start space-x-3 text-sm"
            >
              <div className="mt-0.5">{getIcon(rec.type)}</div>
              <div>
                <p>{rec.description}</p>
                <p className="text-xs text-muted-foreground">
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
