"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const result = await resetPassword(email);

    if (result.success) {
      setSuccess(true);
      setEmail("");
    } else {
      setError(result.error || "Failed to send reset email");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-serif text-primary">
              LyLux Belladonna
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white dark:bg-[#1a2332] rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <span className="material-symbols-outlined text-3xl text-primary">
                lock_reset
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">
                  check_circle
                </span>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Password reset email sent!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Check your inbox for instructions to reset your password.
                    Don't forget to check your spam folder.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-[#0f1623] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
                disabled={success}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-primary text-background-dark font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Sending..."
                : success
                ? "Email Sent"
                : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              Back to Login
            </Link>
          </div>

          {/* Register Link */}
          {!success && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
