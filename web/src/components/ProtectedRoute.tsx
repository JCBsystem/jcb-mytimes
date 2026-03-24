import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth.tsx";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, projectKey, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!projectKey) {
    return <Navigate to="/create-project" replace />;
  }

  return <>{children}</>;
}
