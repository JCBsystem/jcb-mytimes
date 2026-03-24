import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth.tsx";
import { AuthForm } from "@/components/AuthForm.tsx";
import { CreateProject } from "@/components/CreateProject.tsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
import { Button } from "@/components/ui/button.tsx";

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
  const { logout, projectKey } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">MyTimes</h1>
        <Button variant="ghost" onClick={logout}>
          Log Out
        </Button>
      </div>
      <p className="text-muted-foreground">
        Your memories will appear here. Project: {projectKey}
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/create-project" element={<CreateProjectRoute />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
