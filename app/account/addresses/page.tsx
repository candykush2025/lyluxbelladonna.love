"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/firestore";
import { updateUserProfile } from "@/lib/auth";

export default function AccountAddresses() {
  const { userProfile } = useAuth();
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: "Shipping",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userProfile?.uid) return;

      try {
        setLoading(true);
        const userData = await getUser(userProfile.uid);
        setUserDetails(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load addresses");
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

  const handleEditAddress = (index: number) => {
    const address = userDetails?.profile?.addresses?.[index];
    if (address) {
      setAddressForm({
        type: address.type || "Shipping",
        name: address.name || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        country: address.country || "United States",
      });
      setEditingAddress(index);
    }
  };

  const handleAddAddress = () => {
    setAddressForm({
      type: "Shipping",
      name: userDetails?.displayName || userProfile?.displayName || "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
    setAddingAddress(true);
  };

  const handleSaveAddress = async () => {
    if (!userProfile?.uid || !userDetails) return;

    setSaving(true);
    try {
      const currentAddresses = userDetails.profile?.addresses || [];
      let updatedAddresses;

      if (editingAddress !== null) {
        // Edit existing address
        updatedAddresses = [...currentAddresses];
        updatedAddresses[editingAddress] = addressForm;
      } else {
        // Add new address
        updatedAddresses = [...currentAddresses, addressForm];
      }

      const result = await updateUserProfile(
        userProfile.uid,
        userDetails.displayName,
        {
          ...userDetails.profile,
          addresses: updatedAddresses,
        }
      );

      if (result.success) {
        // Refresh user data
        const updatedUser = await getUser(userProfile.uid);
        setUserDetails(updatedUser);
        setEditingAddress(null);
        setAddingAddress(false);
      } else {
        setError(result.error || "Failed to save address");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!userProfile?.uid || !userDetails) return;

    setSaving(true);
    try {
      const currentAddresses = userDetails.profile?.addresses || [];
      const updatedAddresses = currentAddresses.filter(
        (_: any, i: number) => i !== index
      );

      const result = await updateUserProfile(
        userProfile.uid,
        userDetails.displayName,
        {
          ...userDetails.profile,
          addresses: updatedAddresses,
        }
      );

      if (result.success) {
        // Refresh user data
        const updatedUser = await getUser(userProfile.uid);
        setUserDetails(updatedUser);
      } else {
        setError(result.error || "Failed to delete address");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAddressEdit = () => {
    setEditingAddress(null);
    setAddingAddress(false);
    setError(null);
  };

  return (
    <ProtectedRoute>
      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center gap-4 border-b border-[#e0e0e0] dark:border-[#304a6e] bg-white dark:bg-[#0a192f] px-6 py-4 lg:px-10">
          <Link
            className="flex items-center gap-4 text-[#0a192f] dark:text-[#f5f5dc]"
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
            <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-xl font-bold leading-tight tracking-[-0.015em]">
              Lylux Belladonna
            </h2>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link
              className="text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] hover:text-primary transition-colors"
              href="/products"
            >
              Shop
            </Link>
            <Link
              className="text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] hover:text-primary transition-colors"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] hover:text-primary transition-colors"
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
              <span className="text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc]">
                {userProfile?.displayName || "User"}
              </span>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 bg-white dark:bg-[#172a46] border-r border-[#e0e0e0] dark:border-[#304a6e] p-6">
            <nav className="space-y-2">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors"
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors"
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors"
                href="/account/details"
              >
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
                <p className="text-sm font-medium leading-normal">My Details</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20"
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-[#172a46]/50 transition-colors w-full text-left"
              >
                <span className="material-symbols-outlined text-xl">
                  logout
                </span>
                <p className="text-sm font-medium leading-normal">Logout</p>
              </button>
            </div>
          </aside>
          <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-[#f5f5dc] dark:bg-[#0a192f]">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
                <h1 className="text-[#0a192f] dark:text-[#f5f5dc] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                  Saved Addresses
                </h1>
              </div>

              {loading ? (
                <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                  <div className="text-center text-[#5c5c5c] dark:text-[#a8b2d1]">
                    Loading addresses...
                  </div>
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                  <div className="text-center text-red-500">{error}</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userDetails?.profile?.addresses &&
                  userDetails.profile.addresses.length > 0 ? (
                    userDetails.profile.addresses.map(
                      (address: any, index: number) =>
                        editingAddress === index ? (
                          <div
                            key={index}
                            className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm"
                          >
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                  Address Type
                                </label>
                                <select
                                  value={addressForm.type}
                                  onChange={(e) =>
                                    setAddressForm((prev) => ({
                                      ...prev,
                                      type: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value="Shipping">Shipping</option>
                                  <option value="Billing">Billing</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  value={addressForm.name}
                                  onChange={(e) =>
                                    setAddressForm((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                  Street Address
                                </label>
                                <input
                                  type="text"
                                  value={addressForm.street}
                                  onChange={(e) =>
                                    setAddressForm((prev) => ({
                                      ...prev,
                                      street: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                    City
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.city}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        city: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                    State
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.state}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        state: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                    ZIP Code
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.zipCode}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        zipCode: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                    Country
                                  </label>
                                  <input
                                    type="text"
                                    value={addressForm.country}
                                    onChange={(e) =>
                                      setAddressForm((prev) => ({
                                        ...prev,
                                        country: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={handleSaveAddress}
                                  disabled={saving}
                                  className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0a192f] text-sm font-bold leading-normal hover:opacity-90 transition-opacity disabled:opacity-50 flex"
                                >
                                  {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={handleCancelAddressEdit}
                                  className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-[#e0e0e0] dark:border-[#304a6e] text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-bold leading-normal hover:bg-[#f5f5f5] dark:hover:bg-[#1a2332] transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm flex flex-col justify-between"
                          >
                            <div className="mb-4">
                              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">
                                {address.type || "Shipping"}
                              </p>
                              <p className="text-[#0a192f] dark:text-[#f5f5dc] leading-relaxed">
                                {address.name || userDetails.displayName}
                                <br />
                                {address.street}
                                <br />
                                {address.city}, {address.state}{" "}
                                {address.zipCode}
                                <br />
                                {address.country}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleEditAddress(index)}
                                className="text-sm font-bold text-primary hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(index)}
                                className="text-sm font-bold text-[#5c5c5c] dark:text-[#a8b2d1] hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                    )
                  ) : (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm flex flex-col justify-center items-center border-2 border-dashed border-[#e0e0e0] dark:border-[#304a6e] h-full min-h-40 col-span-2">
                      <div className="text-center text-[#5c5c5c] dark:text-[#a8b2d1]">
                        No addresses saved yet
                      </div>
                    </div>
                  )}
                  {addingAddress ? (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                            Address Type
                          </label>
                          <select
                            value={addressForm.type}
                            onChange={(e) =>
                              setAddressForm((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="Shipping">Shipping</option>
                            <option value="Billing">Billing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={addressForm.name}
                            onChange={(e) =>
                              setAddressForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={addressForm.street}
                            onChange={(e) =>
                              setAddressForm((prev) => ({
                                ...prev,
                                street: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  state: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              value={addressForm.zipCode}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  zipCode: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              value={addressForm.country}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  country: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={handleSaveAddress}
                            disabled={saving}
                            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0a192f] text-sm font-bold leading-normal hover:opacity-90 transition-opacity disabled:opacity-50 flex"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelAddressEdit}
                            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-[#e0e0e0] dark:border-[#304a6e] text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-bold leading-normal hover:bg-[#f5f5f5] dark:hover:bg-[#1a2332] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm flex flex-col justify-center items-center border-2 border-dashed border-[#e0e0e0] dark:border-[#304a6e] h-full min-h-40">
                      <button
                        onClick={handleAddAddress}
                        className="flex flex-col items-center gap-2 text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-4xl">
                          add_circle
                        </span>
                        <span className="text-sm font-bold">
                          Add New Address
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
