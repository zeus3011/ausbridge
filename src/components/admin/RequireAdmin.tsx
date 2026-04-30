import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold mb-3">Access denied</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your account ({user.email}) is signed in but does not have admin access to the CMS.
            Ask an existing admin to grant you the <code className="px-1 rounded bg-muted">admin</code> role.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}