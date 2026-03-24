import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "@/lib/auth.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/components/ui/toast.tsx";

const friendlyErrors: Record<string, string> = {
  "auth/email-already-in-use": "That email is already taken. Try logging in instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/configuration-not-found": "Sign-in is not configured yet. Please contact support.",
};

function getFriendlyMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    if (friendlyErrors[code]) return friendlyErrors[code];
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export function AuthForm() {
  const { signUp, login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      toast(getFriendlyMessage(err));
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
            data-testid="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          />
          <input
            type="password"
            placeholder="Password"
            minLength={6}
            required
            data-testid="input-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          />
          <Button type="submit" disabled={submitting} data-testid={isSignUp ? "btn-signup" : "btn-login"}>
            {submitting
              ? "Please wait..."
              : isSignUp
                ? "Sign Up"
                : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            data-testid={isSignUp ? "link-login" : "link-signup"}
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
