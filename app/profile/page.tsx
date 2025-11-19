"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, changePassword } from "@/lib/auth";
import { getUser } from "@/lib/firestore";

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "password"
  >("profile");

  // Profile form
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      loadProfile();
    }
  }, [user, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setEmail(user.email || "");
      setDisplayName(userProfile?.displayName || user.displayName || "");
      setPhone(userProfile?.profile?.phone || "");
      // Normalize addresses coming from the backend: ensure each address has a unique id
      const rawAddresses = (userProfile?.profile?.addresses || []) as any[];
      const normalized = rawAddresses.map((a, idx) => ({
        id: a?.id || `${user.uid}-addr-${idx}-${Date.now()}`,
        label: a?.label || "",
        name: a?.name || "",
        street: a?.street || "",
        city: a?.city || "",
        state: a?.state || "",
        zipCode: a?.zipCode || "",
        country: a?.country || "",
        phone: a?.phone || "",
        isDefault: !!a?.isDefault,
      }));
      setAddresses(normalized);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const result = await updateUserProfile(user.uid, displayName, {
        phone,
        addresses,
      });

      if (result.success) {
        alert("Profile updated successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      label: "Home",
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      phone: "",
      isDefault: addresses.length === 0,
    };
    setEditingAddress(newAddress);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (!editingAddress || !user) return;

    const exists = addresses.find((a) => a.id === editingAddress.id);
    let updatedAddresses;

    if (exists) {
      updatedAddresses = addresses.map((a) =>
        a.id === editingAddress.id ? editingAddress : a
      );
    } else {
      updatedAddresses = [...addresses, editingAddress];
    }

    // If this is the default address, remove default from others
    if (editingAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) =>
        a.id === editingAddress.id ? a : { ...a, isDefault: false }
      );
    }

    try {
      setLoading(true);
      const result = await updateUserProfile(user.uid, displayName, {
        phone,
        addresses: updatedAddresses,
      });

      if (result.success) {
        setAddresses(updatedAddresses);
        setShowAddressForm(false);
        setEditingAddress(null);
        alert("Address saved successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    if (!user) return;

    const updatedAddresses = addresses.filter((a) => a.id !== addressId);

    try {
      setLoading(true);
      const result = await updateUserProfile(user.uid, displayName, {
        phone,
        addresses: updatedAddresses,
      });

      if (result.success) {
        setAddresses(updatedAddresses);
        alert("Address deleted successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy group/design-root overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <div className="px-4 sm:px-10 py-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-cream mb-2">
              My Profile
            </h1>
            <p className="text-cream/70">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-white/20 overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === "profile"
                  ? "text-gold border-b-2 border-gold"
                  : "text-cream/70 hover:text-cream"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === "addresses"
                  ? "text-gold border-b-2 border-gold"
                  : "text-cream/70 hover:text-cream"
              }`}
            >
              Addresses
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === "password"
                  ? "text-gold border-b-2 border-gold"
                  : "text-cream/70 hover:text-cream"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white/5 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-cream mb-6">
                Profile Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-navy/50 border border-white/20 text-cream/50 cursor-not-allowed"
                  />
                  <p className="text-cream/50 text-xs mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gold text-navy px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-cream">My Addresses</h2>
                <button
                  onClick={handleAddAddress}
                  className="bg-gold text-navy px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  + Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-8 text-center">
                  <span className="material-symbols-outlined text-6xl text-cream/50 mb-4">
                    location_on
                  </span>
                  <p className="text-cream/70">No addresses saved yet</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address, idx) => (
                    <div
                      key={address.id ?? `address-${idx}`}
                      className="bg-white/5 rounded-xl p-6 relative"
                    >
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 bg-gold text-navy text-xs px-2 py-1 rounded-full font-bold">
                          DEFAULT
                        </span>
                      )}
                      <h3 className="text-cream font-bold mb-2">
                        {address.label}
                      </h3>
                      <p className="text-cream/80 text-sm">{address.name}</p>
                      <p className="text-cream/80 text-sm">{address.street}</p>
                      <p className="text-cream/80 text-sm">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-cream/80 text-sm">{address.country}</p>
                      <p className="text-cream/80 text-sm">{address.phone}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-gold hover:text-gold/80 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address Form Modal */}
              {showAddressForm && editingAddress && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="bg-navy rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-cream">
                        {addresses.find((a) => a.id === editingAddress.id)
                          ? "Edit Address"
                          : "Add New Address"}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        className="text-cream/70 hover:text-cream"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveAddress();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-cream mb-2">
                          Address Label
                        </label>
                        <input
                          type="text"
                          value={editingAddress.label}
                          onChange={(e) =>
                            setEditingAddress({
                              ...editingAddress,
                              label: e.target.value,
                            })
                          }
                          placeholder="e.g., Home, Work, Billing"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cream mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editingAddress.name}
                          onChange={(e) =>
                            setEditingAddress({
                              ...editingAddress,
                              name: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cream mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={editingAddress.street}
                          onChange={(e) =>
                            setEditingAddress({
                              ...editingAddress,
                              street: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-cream mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={editingAddress.city}
                            onChange={(e) =>
                              setEditingAddress({
                                ...editingAddress,
                                city: e.target.value,
                              })
                            }
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cream mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={editingAddress.state}
                            onChange={(e) =>
                              setEditingAddress({
                                ...editingAddress,
                                state: e.target.value,
                              })
                            }
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-cream mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={editingAddress.zipCode}
                            onChange={(e) =>
                              setEditingAddress({
                                ...editingAddress,
                                zipCode: e.target.value,
                              })
                            }
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cream mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={editingAddress.country}
                            onChange={(e) =>
                              setEditingAddress({
                                ...editingAddress,
                                country: e.target.value,
                              })
                            }
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cream mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editingAddress.phone}
                          onChange={(e) =>
                            setEditingAddress({
                              ...editingAddress,
                              phone: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingAddress.isDefault}
                            onChange={(e) =>
                              setEditingAddress({
                                ...editingAddress,
                                isDefault: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-white/20 text-gold focus:ring-gold focus:ring-offset-0"
                          />
                          <span className="text-cream text-sm">
                            Set as default address
                          </span>
                        </label>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-gold text-navy px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Saving..." : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                          }}
                          className="px-6 py-3 rounded-lg bg-white/10 text-cream hover:bg-white/20 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="bg-white/5 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-cream mb-6">
                Change Password
              </h2>
              <form
                onSubmit={handleChangePassword}
                className="space-y-6 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                  />
                  <p className="text-cream/50 text-xs mt-1">
                    Minimum 6 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gold text-navy px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
