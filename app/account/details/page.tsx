"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/firestore";
import { updateUserProfile } from "@/lib/auth";

export default function AccountDetails() {
  const { userProfile } = useAuth();
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userProfile?.uid) return;

      try {
        setLoading(true);
        const userData = await getUser(userProfile.uid);
        setUserDetails(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userProfile?.uid]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const handleEditDetails = () => {
    setEditForm({
      displayName: userDetails?.displayName || userProfile?.displayName || "",
      phone: userDetails?.profile?.phone || "",
    });
    setEditingDetails(true);
  };

  const handleSaveDetails = async () => {
    if (!userProfile?.uid || !userDetails) return;

    setSaving(true);
    try {
      const result = await updateUserProfile(
        userProfile.uid,
        editForm.displayName,
        {
          ...userDetails.profile,
          phone: editForm.phone,
        }
      );

      if (result.success) {
        // Refresh user data
        const updatedUser = await getUser(userProfile.uid);
        setUserDetails(updatedUser);
        setEditingDetails(false);
      } else {
        setError(result.error || "Failed to update details");
      }
    } catch (err) {
      console.error("Error updating details:", err);
      setError("Failed to update details");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingDetails(false);
    setError(null);
  };

  return (
    <ProtectedRoute>
      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center gap-4 border-b border-[#e0e0e0] bg-[#1a2332] px-6 py-4 lg:px-10">
          <Link
            className="flex items-center gap-4 text-[#0a192f]"
            href="/"
          >
            <div className="size-8 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_6_330)">
                  <path
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#0a192f] text-xl font-bold leading-tight tracking-[-0.015em]">
              Lylux Belladonna
            </h2>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link
              className="text-sm font-medium text-[#0a192f] hover:text-primary transition-colors"
              href="/products"
            >
              Shop
            </Link>
            <Link
              className="text-sm font-medium text-[#0a192f] hover:text-primary transition-colors"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium text-[#0a192f] hover:text-primary transition-colors"
              href="/contact"
            >
              Contact
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                style={{
                  backgroundImage: `url("https://via.placeholder.com/32")`,
                }}
              ></div>
              <span className="text-sm font-medium text-[#0a192f]">
                {userProfile?.displayName || "User"}
              </span>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 bg-[#1a2332] border-r border-[#e0e0e0] p-6">
            <nav className="space-y-2">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
                href="/account"
              >
                <span className="material-symbols-outlined text-xl">
                  grid_view
                </span>
                <p className="text-sm font-semibold leading-normal">
                  Dashboard
                </p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
                href="/account/orders"
              >
                <span className="material-symbols-outlined text-xl">
                  package_2
                </span>
                <p className="text-sm font-medium leading-normal">
                  Order History
                </p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20"
                href="/account/details"
              >
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
                <p className="text-sm font-medium leading-normal">My Details</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
                href="/account/addresses"
              >
                <span className="material-symbols-outlined text-xl">
                  location_on
                </span>
                <p className="text-sm font-medium leading-normal">
                  Saved Addresses
                </p>
              </Link>
            </nav>
            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors w-full text-left"
              >
                <span className="material-symbols-outlined text-xl">
                  logout
                </span>
                <p className="text-sm font-medium leading-normal">Logout</p>
              </button>
            </div>
          </aside>
          <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-[#f5f5dc]">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
                <h1 className="text-[#0a192f] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                  My Details
                </h1>
              </div>

              {loading ? (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-center text-[#5c5c5c]">
                    Loading user details...
                  </div>
                </div>
              ) : error ? (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-center text-red-500">{error}</div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex flex-col h-full justify-between">
                    {editingDetails ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0a192f] mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editForm.displayName}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                displayName: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg bg-[#1a2332] text-[#0a192f] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0a192f] mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-[#e0e0e0] rounded-lg bg-[#1a2332] text-[#0a192f] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={handleSaveDetails}
                            disabled={saving}
                            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0a192f] text-sm font-bold leading-normal hover:opacity-90 transition-opacity disabled:opacity-50 flex"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-[#e0e0e0] text-[#5c5c5c] text-sm font-bold leading-normal hover:bg-[#f5f5f5] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                            style={{
                              backgroundImage: `url("${
                                userDetails?.profile?.avatar ||
                                "https://via.placeholder.com/48"
                              }")`,
                            }}
                          ></div>
                          <div className="flex flex-col">
                            <h3 className="text-[#0a192f] text-base font-medium leading-normal">
                              {userDetails?.displayName ||
                                userProfile?.displayName ||
                                "User"}
                            </h3>
                            <p className="text-[#5c5c5c] text-sm font-normal leading-normal">
                              {userDetails?.email || userProfile?.email || ""}
                            </p>
                            {userDetails?.profile?.phone && (
                              <p className="text-[#5c5c5c] text-sm font-normal leading-normal">
                                {userDetails.profile.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={handleEditDetails}
                          className="flex mt-6 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-primary text-primary text-sm font-bold leading-normal hover:bg-primary/10 transition-colors"
                        >
                          <span>Edit Details</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}



