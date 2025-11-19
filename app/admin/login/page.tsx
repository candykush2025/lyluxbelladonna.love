"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAdmin(formData.email, formData.password);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Admin login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <span className="material-symbols-outlined text-3xl text-background-dark">
              admin_panel_settings
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">
            LyLux Belladonna Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Admin Login
          </h2>

          {/* Default Credentials Notice */}
          <div className="mb-6 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-blue-400 text-lg shrink-0">
                info
              </span>
              <div className="text-xs text-blue-300">
                <p className="font-medium mb-1">Default Admin Credentials:</p>
                <p>
                  <strong>Email:</strong> testadmin@example.com
                </p>
                <p>
                  <strong>Password:</strong> Admin123!
                </p>
                <p className="mt-2 text-blue-400/80">
                  Copy these credentials to login, or use your custom admin
                  account if you've created one.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-lg">
                  error
                </span>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                placeholder="testadmin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-background-dark font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-lg">
                    progress_activity
                  </span>
                  Authenticating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    login
                  </span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-yellow-500 text-lg shrink-0">
                shield
              </span>
              <p className="text-xs text-yellow-300">
                This is a secure admin area. Only authorized personnel with
                admin privileges can access this portal. All login attempts are
                monitored and logged.
              </p>
            </div>
          </div>

          {/* Customer Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-primary flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              Customer Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-base">home</span>
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
