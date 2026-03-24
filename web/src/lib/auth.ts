import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult,
  type User,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { auth, functions } from "@/lib/firebase.ts";

export interface AuthState {
  user: User | null;
  projectKey: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createProject: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    projectKey: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await getIdTokenResult(firebaseUser);
        const projectKey = (tokenResult.claims.projectKey as string) ?? null;
        setState({ user: firebaseUser, projectKey, loading: false });
      } else {
        setState({ user: null, projectKey: null, loading: false });
      }
    });
    return unsubscribe;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const createProjectFn = useCallback(async (): Promise<string> => {
    const callable = httpsCallable<void, { projectKey: string }>(functions, "createProject");
    const result = await callable();
    const projectKey = result.data.projectKey;

    // Force token refresh so the new custom claim is picked up immediately
    await auth.currentUser!.getIdToken(true);
    const tokenResult = await getIdTokenResult(auth.currentUser!);
    const claimKey = tokenResult.claims.projectKey as string;

    setState((prev) => ({ ...prev, projectKey: claimKey }));
    return projectKey;
  }, []);

  const value: AuthContextValue = {
    ...state,
    signUp,
    login,
    logout,
    createProject: createProjectFn,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
