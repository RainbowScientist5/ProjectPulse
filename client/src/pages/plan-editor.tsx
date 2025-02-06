import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AIRecommendations } from "@/components/infrastructure/ai-recommendations";
import { insertPlanSchema, type Plan } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/lib/auth";

export default function PlanEditor() {
  const { id } = useParams();
  const { user } = useAuthCheck();
  const { toast } = useToast();

  const { data: plan } = useQuery<Plan>({
    queryKey: ["/api/plans", id],
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(insertPlanSchema),
    defaultValues: plan || {
      title: "",
      description: "",
      userId: user?.id,
      content: { components: [], connections: [] },
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.getValues) => {
      if (id) {
        return apiRequest("PATCH", `/api/plans/${id}`, values);
      }
      return apiRequest("POST", "/api/plans", values);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Plan saved successfully",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? "Edit Plan" : "New Plan"}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving..." : "Save Plan"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {plan && <AIRecommendations plan={plan} />}
      </div>
    </div>
  );
}
