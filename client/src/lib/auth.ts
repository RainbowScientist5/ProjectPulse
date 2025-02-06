import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

const GITHUB_CLIENT_ID = "your_github_client_id";

export function useAuthCheck() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

export async function initiateGithubLogin() {
  const redirectUri = `${window.location.origin}/login/callback`;
  const scope = "read:user repo";
  
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
}

export async function handleGithubCallback(code: string) {
  const response = await fetch("/api/auth/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to authenticate with GitHub");
  }
  
  return response.json();
}
