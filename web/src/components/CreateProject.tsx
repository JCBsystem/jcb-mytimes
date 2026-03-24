import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth.tsx";
import { useToast } from "@/components/ui/toast.tsx";
import { Button } from "@/components/ui/button.tsx";

export function CreateProject() {
  const { createProject } = useAuth();
  const { toast } = useToast();
  const [failed, setFailed] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    createProject().catch((err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to set up your space";
      toast(message);
      setFailed(true);
    });
  }, [createProject, toast]);

  if (failed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Something went wrong setting up your space.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setFailed(false);
              attempted.current = false;
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-8 text-center">
        <div className="animate-spin h-6 w-6 mx-auto border-2 border-foreground border-t-transparent rounded-full" />
        <p className="text-sm text-muted-foreground">Creating your space...</p>
      </div>
    </div>
  );
}
