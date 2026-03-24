import { useCallback, useEffect, useMemo, useState } from "react";
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
  const { memories, create, remove } = useMemoriesContext();
  const [search, setSearch] = useState("");
  const [matchedIds, setMatchedIds] = useState<Set<string> | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setMatchedIds(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const ids = await searchMemories(query);
      setMatchedIds(new Set(ids));
    } catch (err) {
      console.error("Search failed:", err);
      setMatchedIds(new Set());
    } finally {
      setSearching(false);
    }
  }, []);

  // Filter listener data by server-returned IDs
  const filtered = matchedIds !== null
    ? memories.filter((m) => matchedIds.has(m.id))
    : memories;

  // Compute tag suggestions from existing memories
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    memories.forEach((m) => m.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [memories]);

  const handleDelete = async (memoryId: string) => {
    await remove(memoryId);
  };

  const handleSend = async (data: {
    text: string;
    image?: File;
    tags?: string[];
    mood?: number;
    people?: string[];
    eventDate?: string;
  }) => {
    return await create(data);
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
        <Timeline memories={filtered} onDelete={handleDelete} />
      </div>
      <BottomBar onSend={handleSend} allTags={allTags} />
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
