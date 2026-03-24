import { useState } from "react";
import { useAuth } from "@/lib/auth.tsx";
import { Button } from "@/components/ui/button.tsx";

export function CreateProject() {
  const { createProject } = useAuth();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    setCreating(true);
    try {
      await createProject();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create project";
      setError(message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to MyTimes
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up your personal space to start capturing memories.
          </p>
        </div>

        <Button onClick={handleCreate} disabled={creating} className="w-full">
          {creating ? "Setting up..." : "Create My Space"}
        </Button>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
