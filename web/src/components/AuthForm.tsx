import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "@/lib/auth.tsx";
import { Button } from "@/components/ui/button.tsx";

export function AuthForm() {
  const { signUp, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">MyTimes</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          />
          <input
            type="password"
            placeholder="Password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          />
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : isSignUp
                ? "Sign Up"
                : "Log In"}
          </Button>
        </form>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {isSignUp
              ? "Already have an account? Log in"
              : "Need an account? Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
