import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plan } from "@shared/schema";
import { Link } from "wouter";
import { CalendarDays, Edit2 } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {plan.title}
        </CardTitle>
        <Link href={`/plans/${plan.id}`}>
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {plan.description}
        </p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          {new Date(plan.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
