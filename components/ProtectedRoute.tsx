"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not logged in - redirect to login
      if (!user) {
        router.push(requireAdmin ? "/admin/login" : "/login");
        return;
      }

      // Logged in but need admin access - redirect regular users to their account
      if (requireAdmin && !isAdmin) {
        // Regular user trying to access admin area - redirect to customer dashboard
        router.push("/account");
        return;
      }
    }
  }, [user, userProfile, loading, isAdmin, requireAdmin, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!user) {
    return null;
  }

  // Check admin access - show error message for non-admin users
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
              block
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access the admin dashboard. This area
            is restricted to administrators only.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Redirecting to your account...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
