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
import { usePwaInstall } from "@/hooks/usePwaInstall.ts";
import { Download } from "lucide-react";
import { toast } from "sonner";
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
  const { canInstall, install } = usePwaInstall();
  const { memories, create, update, remove } = useMemoriesContext();
  const [search, setSearch] = useState("");
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string> | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setMatchedIds(null);
      setSearching(false);
      return;
    }

    // Instant client-side filter from already-loaded memories
    const needle = query.toLowerCase();
    const clientIds = new Set(
      memories
        .filter((m) =>
          m.text.toLowerCase().includes(needle) ||
          m.transcript?.toLowerCase().includes(needle) ||
          m.people?.some((p) => p.toLowerCase().includes(needle)) ||
          m.tags?.some((t) => t.toLowerCase().includes(needle))
        )
        .map((m) => m.id)
    );
    setMatchedIds(clientIds);

    // Server search in parallel — may return additional hits
    setSearching(true);
    try {
      const serverIds = await searchMemories(query);
      setMatchedIds(new Set([...clientIds, ...serverIds]));
    } catch (err) {
      console.error("Search failed:", err);
      // Keep client results on server failure
    } finally {
      setSearching(false);
    }
  }, [memories]);

  // Filter listener data by matched IDs
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
    <div className="relative min-h-screen bg-stone-50/40" data-testid="view-dashboard">
      <div className="fixed top-0 inset-x-0 z-20 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-5 py-3">
          <h1 className="text-base font-bold tracking-tight text-stone-800">MyTimes</h1>
          <div className="flex items-center gap-1">
            {canInstall && (
              <Button variant="ghost" size="sm" onClick={install}>
                <Download className="size-4 mr-1" />
                Install
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={logout} data-testid="btn-logout">
              Log Out
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto pt-14">
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
        <Timeline memories={filtered} onDelete={handleDelete} onEdit={setEditingMemory} />
      </div>
      <BottomBar
        onSend={handleSend}
        onUpdate={update}
        editingMemory={editingMemory}
        onEditDone={() => setEditingMemory(null)}
        allTags={allTags}
      />
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
