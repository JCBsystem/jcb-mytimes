import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth.tsx";
import { AuthForm } from "@/components/AuthForm.tsx";
import { CreateProject } from "@/components/CreateProject.tsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SearchBar } from "@/components/SearchBar.tsx";
import { Timeline } from "@/components/Timeline.tsx";
import { BottomBar } from "@/components/BottomBar.tsx";
import { MemoriesProvider, useMemoriesContext } from "@/lib/memories-context.tsx";

function LoginRoute() {
  const { user, projectKey, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user && projectKey) {
    return <Navigate to="/" replace />;
  }

  if (user && !projectKey) {
    return <Navigate to="/create-project" replace />;
  }

  return <AuthForm />;
}

function CreateProjectRoute() {
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

  if (projectKey) {
    return <Navigate to="/" replace />;
  }

  return <CreateProject />;
}

function AppShell() {
  const { logout } = useAuth();
  const { memories, loading, create, remove } = useMemoriesContext();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? memories.filter((m) =>
        m.text.toLowerCase().includes(search.toLowerCase()),
      )
    : memories;

  const handleSend = async (data: { text: string; image?: File }) => {
    await create(data);
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 inset-x-0 z-20 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-2 border-b border-border/50">
        <h1 className="text-lg font-semibold">MyTimes</h1>
        <Button variant="ghost" size="sm" onClick={logout}>
          Log Out
        </Button>
      </div>
      <div className="pt-12">
        <SearchBar value={search} onChange={setSearch} />
        <Timeline memories={filtered} />
      </div>
      <BottomBar onSend={handleSend} />
    </div>
  );
}

function SignOutRoute() {
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      logout();
    }
  }, [logout, loading, user]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing out...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signout" element={<SignOutRoute />} />
        <Route path="/create-project" element={<CreateProjectRoute />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MemoriesProvider>
                <AppShell />
              </MemoriesProvider>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
