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

      // Logged in but need admin access
      if (requireAdmin && !isAdmin) {
        router.push("/admin/login");
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

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
