import { Plan } from "@shared/schema";

export async function getAIRecommendations(plan: Plan) {
  // This would normally call Azure AI services
  // Mocked for demo purposes
  return [
    {
      id: 1,
      type: "optimization",
      description: "Consider using load balancing for your web servers to improve availability",
      confidence: 0.85
    },
    {
      id: 2,
      type: "security",
      description: "Add a firewall between the public and private subnets",
      confidence: 0.92
    },
    {
      id: 3,
      type: "cost",
      description: "Using reserved instances could reduce costs by 40%",
      confidence: 0.78
    }
  ];
}
