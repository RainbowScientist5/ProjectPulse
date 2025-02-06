import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/infrastructure/plan-card";
import { Plan } from "@shared/schema";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useAuthCheck } from "@/lib/auth";

export default function Dashboard() {
  const { user } = useAuthCheck();
  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans", { userId: user?.id }],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Infrastructure Plans</h1>
        <Link href="/plans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[200px] animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
          {plans?.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              No plans yet. Create your first infrastructure plan!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
