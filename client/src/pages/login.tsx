import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initiateGithubLogin, handleGithubCallback } from "@/lib/auth";
import { SiGithub } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    
    if (code) {
      handleGithubCallback(code)
        .then(() => {
          setLocation("/");
        })
        .catch((error) => {
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            IT Infrastructure Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => initiateGithubLogin()}
            size="lg"
          >
            <SiGithub className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
