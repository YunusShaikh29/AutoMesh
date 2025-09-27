import { Navigate } from "react-router-dom";
import { userAuthStore } from "../store/authStore";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = userAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
        <div className="text-center space-y-4">
          <div className="animate-pulse-subtle w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
