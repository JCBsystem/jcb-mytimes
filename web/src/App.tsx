import { useCallback, useEffect, useState } from "react";
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
import { searchMemories } from "@/lib/search.ts";
import type { Memory } from "@/types/memory.ts";

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
  const { memories, create } = useMemoriesContext();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Memory[] | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const results = await searchMemories(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const filtered = searchResults !== null ? searchResults : memories;

  const handleSend = async (data: { text: string; image?: File }) => {
    await create(data);
  };

  return (
    <div className="relative min-h-screen" data-testid="view-dashboard">
      <div className="fixed top-0 inset-x-0 z-20 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-2 border-b border-border/50">
        <h1 className="text-lg font-semibold">MyTimes</h1>
        <Button variant="ghost" size="sm" onClick={logout} data-testid="btn-logout">
          Log Out
        </Button>
      </div>
      <div className="pt-12">
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
        {searching && (
          <div className="flex justify-center py-4">
            <p className="text-sm text-muted-foreground">Searching...</p>
          </div>
        )}
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
