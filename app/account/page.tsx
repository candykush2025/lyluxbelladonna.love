"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getOrders, getUser } from "@/lib/firestore";
import { updateUserProfile } from "@/lib/auth";

export default function Account() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "details" | "addresses"
  >("dashboard");

  // Details state
  const [editingDetails, setEditingDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    preferredLanguage: "English",
    newsletter: false,
  });
  const [saving, setSaving] = useState(false);

  // Addresses state
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: "Shipping",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.uid) return;

      try {
        setLoading(true);
        const [ordersData, userData] = await Promise.all([
          getOrders(userProfile.uid),
          getUser(userProfile.uid),
        ]);

        // Check payment status for pending orders
        const ordersWithUpdatedStatus = await Promise.all(
          ordersData.map(async (order: any) => {
            // Only check status for pending orders with invoice ID
            if (order.paymentStatus === "pending" && order.xenditInvoiceId) {
              try {
                const response = await fetch("/api/payments/check-status", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderId: order.id,
                    invoiceId: order.xenditInvoiceId,
                  }),
                });

                if (response.ok) {
                  const result = await response.json();
                  console.log(`Order ${order.id} status updated:`, result);

                  // Return updated order with new status
                  return {
                    ...order,
                    paymentStatus: result.paymentStatus,
                    status: result.orderStatus,
                  };
                }
              } catch (err) {
                console.error(
                  `Error checking status for order ${order.id}:`,
                  err
                );
              }
            }
            // Return order unchanged if not pending or check failed
            return order;
          })
        );

        setOrders(ordersWithUpdatedStatus);
        setUserDetails(userData);
      } catch (err) {
        console.error("Error fetching account data:", err);
        setError("Failed to load account data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Details handlers
  const handleEditDetails = () => {
    setEditForm({
      displayName: userDetails?.displayName || userProfile?.displayName || "",
      phone: userDetails?.profile?.phone || "",
      dateOfBirth: userDetails?.profile?.dateOfBirth || "",
      gender: userDetails?.profile?.gender || "",
      preferredLanguage: userDetails?.profile?.preferredLanguage || "English",
      newsletter: userDetails?.profile?.newsletter || false,
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
          dateOfBirth: editForm.dateOfBirth,
          gender: editForm.gender,
          preferredLanguage: editForm.preferredLanguage,
          newsletter: editForm.newsletter,
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

  // Address handlers
  const handleEditAddress = (index: number) => {
    const address = userDetails?.profile?.addresses?.[index];
    if (address) {
      setAddressForm({
        type: address.type || "Shipping",
        name: address.name || "",
        phone: address.phone || "",
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
      phone: userDetails?.profile?.phone || "",
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
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e0e0] dark:border-[#304a6e] px-6 md:px-10 py-3 sticky top-0 bg-[#f5f5dc]/80 dark:bg-[#0a192f]/80 backdrop-blur-sm z-50">
          <div className="flex items-center gap-8">
            <Link
              className="flex items-center gap-4 text-[#0a192f] dark:text-[#f5f5dc]"
              href="/"
            >
              <div className="size-6 text-primary">
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
              <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold leading-tight tracking-[-0.015em]">
                Lylux Belladonna
              </h2>
            </Link>
            <nav className="hidden md:flex items-center gap-9">
              <Link
                className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
                href="/products"
              >
                New Arrivals
              </Link>
              <Link
                className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
                href="/products"
              >
                Collections
              </Link>
              <Link
                className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
                href="/products"
              >
                Bags
              </Link>
              <Link
                className="text-[#0a192f] dark:text-[#f5f5dc] text-sm font-medium leading-normal hover:text-primary transition-colors"
                href="/products"
              >
                Accessories
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-2">
              <Link
                href="/cart"
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0"
              >
                <span className="material-symbols-outlined text-xl">
                  shopping_bag
                </span>
              </Link>
              <Link
                href="/wishlist"
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0"
              >
                <span className="material-symbols-outlined text-xl">
                  favorite
                </span>
              </Link>
            </div>
            <button className="flex md:hidden max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCql-Cr2DaLlgEakuhSeTiVbpNp2mHFk-OvFDxUUZhm5vsWnHX2G_Gn83RK9Gniy2aYSoYQI_-KI9mtXYOCv6ic8zokW0W8P5B8JuGNMcl_l_MgIbdFTvEFrT6bKQahnuQdDkxwMmJftvjn2DS5Bpk-C4uwwShqVoBIoxnKVNNIAGujXiz0U6fef1M_OJ-v8lWQpK5P5grSQmwBsskE7Zmx8LBUBBWjo2JTT-3Io0-02tC-MYcENeDxazBebCO1Cz8eTU9LsrVS8sc")`,
              }}
            ></div>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 min-h-full flex-col justify-between p-4 hidden lg:flex sticky top-[65px] self-start border-r border-[#e0e0e0] dark:border-[#304a6e]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <button
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-white dark:bg-[#172a46] text-primary"
                      : "hover:bg-white/50 dark:hover:bg-[#172a46]/50"
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <span className="material-symbols-outlined text-xl">
                    grid_view
                  </span>
                  <p className="text-sm font-semibold leading-normal">
                    Dashboard
                  </p>
                </button>
                <button
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-white dark:bg-[#172a46] text-primary"
                      : "hover:bg-white/50 dark:hover:bg-[#172a46]/50"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <span className="material-symbols-outlined text-xl">
                    package_2
                  </span>
                  <p className="text-sm font-medium leading-normal">
                    Order History
                  </p>
                </button>
                <button
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "details"
                      ? "bg-white dark:bg-[#172a46] text-primary"
                      : "hover:bg-white/50 dark:hover:bg-[#172a46]/50"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  <span className="material-symbols-outlined text-xl">
                    person
                  </span>
                  <p className="text-sm font-medium leading-normal">
                    My Details
                  </p>
                </button>
                <button
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "addresses"
                      ? "bg-white dark:bg-[#172a46] text-primary"
                      : "hover:bg-white/50 dark:hover:bg-[#172a46]/50"
                  }`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <span className="material-symbols-outlined text-xl">
                    location_on
                  </span>
                  <p className="text-sm font-medium leading-normal">
                    Saved Addresses
                  </p>
                </button>
              </div>
            </div>
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
            <div className="max-w-5xl mx-auto">
              {activeTab === "dashboard" && (
                <>
                  <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
                    <h1 className="text-[#0a192f] dark:text-[#f5f5dc] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                      Welcome back,{" "}
                      {userDetails?.displayName ||
                        userProfile?.displayName ||
                        "User"}
                    </h1>
                  </div>

                  {/* Account Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            shopping_bag
                          </span>
                        </div>
                        <div>
                          <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
                            Total Orders
                          </p>
                          <p className="text-[#0a192f] dark:text-[#f5f5dc] text-2xl font-bold">
                            {orders.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            location_on
                          </span>
                        </div>
                        <div>
                          <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
                            Saved Addresses
                          </p>
                          <p className="text-[#0a192f] dark:text-[#f5f5dc] text-2xl font-bold">
                            {userDetails?.profile?.addresses?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            account_circle
                          </span>
                        </div>
                        <div>
                          <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
                            Member Since
                          </p>
                          <p className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold">
                            {user?.metadata?.creationTime
                              ? new Date(
                                  user.metadata.creationTime
                                ).getFullYear()
                              : new Date().getFullYear()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        Recent Orders
                      </h2>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-primary text-sm font-bold hover:underline"
                      >
                        View All Orders →
                      </button>
                    </div>

                    {loading ? (
                      <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                        <div className="text-center text-[#5c5c5c] dark:text-[#a8b2d1]">
                          Loading orders...
                        </div>
                      </div>
                    ) : error ? (
                      <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                        <div className="text-center text-red-500">{error}</div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                        <div className="text-center text-[#5c5c5c] dark:text-[#a8b2d1]">
                          No orders found
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {orders.slice(0, 2).map((order: any) => (
                          <div
                            key={order.id}
                            className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className="w-16 h-16 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-none"
                                style={{
                                  backgroundImage: `url("${
                                    order.items?.[0]?.image ||
                                    "https://via.placeholder.com/64"
                                  }")`,
                                }}
                              ></div>
                              <div className="flex-1">
                                <p className="text-primary text-sm font-medium leading-normal mb-1">
                                  {order.status || "Processing"}
                                </p>
                                <p className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold leading-tight mb-1">
                                  {order.items?.[0]?.name || "Order Item"}
                                </p>
                                <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal mb-3">
                                  Order #{order.orderNumber || order.id}
                                </p>
                                <button className="text-primary text-sm font-bold hover:underline">
                                  Track Shipment
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h2 className="text-[#0a192f] dark:text-[#f5f5dc] text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Link
                        href="/account/details"
                        className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary">
                              person
                            </span>
                          </div>
                          <h3 className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold">
                            My Details
                          </h3>
                        </div>
                        <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
                          Update your personal information and contact details
                        </p>
                      </Link>

                      <Link
                        href="/account/addresses"
                        className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary">
                              location_on
                            </span>
                          </div>
                          <h3 className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold">
                            Saved Addresses
                          </h3>
                        </div>
                        <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
                          Manage your shipping and billing addresses
                        </p>
                      </Link>

                      <Link
                        href="/products"
                        className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary">
                              shopping_bag
                            </span>
                          </div>
                          <h3 className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold">
                            Continue Shopping
                          </h3>
                        </div>
                        <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
                          Browse our latest collections and new arrivals
                        </p>
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "orders" && (
                <div>
                  <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
                    <h1 className="text-[#0a192f] dark:text-[#f5f5dc] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                      Order History
                    </h1>
                  </div>

                  {loading ? (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="text-center text-[#5c5c5c] dark:text-[#a8b2d1]">
                        Loading orders...
                      </div>
                    </div>
                  ) : error ? (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="text-center text-red-500">{error}</div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="text-center text-[#5c5c5c] dark:text-[#a8b2d1]">
                        No orders found
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order: any) => (
                        <div
                          key={order.id}
                          className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-6">
                            <div
                              className="w-full sm:w-32 md:w-40 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-none"
                              style={{
                                backgroundImage: `url("${
                                  order.items?.[0]?.image ||
                                  "https://via.placeholder.com/150"
                                }")`,
                              }}
                            ></div>
                            <div className="flex flex-1 flex-col gap-4">
                              <div className="flex flex-col gap-1">
                                <p className="text-primary text-sm font-medium leading-normal">
                                  {order.status || "Processing"}
                                </p>
                                <p className="text-[#0a192f] dark:text-[#f5f5dc] text-lg font-bold leading-tight">
                                  {order.items?.[0]?.name || "Order Item"}
                                </p>
                                <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                  Order #{order.orderNumber || order.id}
                                </p>
                                {order.items && order.items.length > 1 && (
                                  <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                    +{order.items.length - 1} more item
                                    {order.items.length - 1 > 1 ? "s" : ""}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {/* Payment button for pending orders */}
                                {order.paymentStatus === "pending" &&
                                  order.xenditInvoiceUrl && (
                                    <a
                                      href={order.xenditInvoiceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold leading-normal w-fit transition-colors gap-2"
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        payment
                                      </span>
                                      <span>Continue Payment</span>
                                    </a>
                                  )}

                                {/* View order button */}
                                <Link
                                  href={`/order-confirmation/${order.id}`}
                                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f5f5dc] dark:bg-[#304a6e] text-[#0a192f] dark:text-[#f5f5dc] text-sm font-bold leading-normal w-fit hover:bg-[#e8e8d1] dark:hover:bg-[#3a5a7e] transition-colors"
                                >
                                  <span>View Order</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div>
                  <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
                    <h1 className="text-[#0a192f] dark:text-[#f5f5dc] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                      My Details
                    </h1>
                  </div>

                  {loading ? (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="text-center text-[#5c5c5c] dark:text-[#a8b2d1]">
                        Loading user details...
                      </div>
                    </div>
                  ) : error ? (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="text-center text-red-500">{error}</div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm">
                      <div className="flex flex-col h-full justify-between">
                        {editingDetails ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
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
                                className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
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
                                className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                Date of Birth
                              </label>
                              <input
                                type="date"
                                value={editForm.dateOfBirth}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    dateOfBirth: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                Gender
                              </label>
                              <select
                                value={editForm.gender}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    gender: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="">Prefer not to say</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc] mb-2">
                                Preferred Language
                              </label>
                              <select
                                value={editForm.preferredLanguage}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    preferredLanguage: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-[#e0e0e0] dark:border-[#304a6e] rounded-lg bg-white dark:bg-[#172a46] text-[#0a192f] dark:text-[#f5f5dc] focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Italian">Italian</option>
                                <option value="Portuguese">Portuguese</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Japanese">Japanese</option>
                              </select>
                            </div>
                            <div>
                              <label className="flex items-center gap-2 text-sm font-medium text-[#0a192f] dark:text-[#f5f5dc]">
                                <input
                                  type="checkbox"
                                  checked={editForm.newsletter}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({
                                      ...prev,
                                      newsletter: e.target.checked,
                                    }))
                                  }
                                  className="rounded border-[#e0e0e0] dark:border-[#304a6e] text-primary focus:ring-primary"
                                />
                                Subscribe to newsletter
                              </label>
                              <p className="text-xs text-[#5c5c5c] dark:text-[#a8b2d1] mt-1">
                                Receive updates about new products and special
                                offers
                              </p>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={handleSaveDetails}
                                disabled={saving}
                                className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0a192f] text-sm font-bold leading-normal shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg flex border-2 border-primary"
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-[#e0e0e0] dark:border-[#304a6e] text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-bold leading-normal hover:bg-[#f5f5f5] dark:hover:bg-[#1a2332] transition-colors"
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
                                <h3 className="text-[#0a192f] dark:text-[#f5f5dc] text-base font-medium leading-normal">
                                  {userDetails?.displayName ||
                                    userProfile?.displayName ||
                                    "User"}
                                </h3>
                                <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                  {userDetails?.email ||
                                    userProfile?.email ||
                                    ""}
                                </p>
                                {userDetails?.profile?.phone && (
                                  <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                    {userDetails.profile.phone}
                                  </p>
                                )}
                                {userDetails?.profile?.dateOfBirth && (
                                  <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                    Born:{" "}
                                    {new Date(
                                      userDetails.profile.dateOfBirth
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                                {userDetails?.profile?.gender && (
                                  <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                    Gender: {userDetails.profile.gender}
                                  </p>
                                )}
                                {userDetails?.profile?.preferredLanguage && (
                                  <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                    Language:{" "}
                                    {userDetails.profile.preferredLanguage}
                                  </p>
                                )}
                                {userDetails?.profile?.newsletter && (
                                  <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-normal leading-normal">
                                    📧 Subscribed to newsletter
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
              )}

              {activeTab === "addresses" && (
                <div>
                  <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
                    <h1 className="text-[#0a192f] dark:text-[#f5f5dc] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                      Saved Addresses
                    </h1>
                    <button
                      onClick={handleAddAddress}
                      className="flex items-center gap-2 cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0a192f] text-sm font-bold leading-normal hover:opacity-90 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add
                      </span>
                      Add Address
                    </button>
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
                        <>
                          {userDetails.profile.addresses.map(
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
                                        <option value="Shipping">
                                          Shipping
                                        </option>
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
                                        Phone Number
                                      </label>
                                      <input
                                        type="tel"
                                        value={addressForm.phone}
                                        onChange={(e) =>
                                          setAddressForm((prev) => ({
                                            ...prev,
                                            phone: e.target.value,
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
                                      {address.phone && (
                                        <>
                                          <br />
                                          {address.phone}
                                        </>
                                      )}
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
                          )}
                        </>
                      ) : (
                        <div className="bg-white dark:bg-[#172a46] p-6 rounded-xl shadow-sm flex flex-col justify-center items-center border-2 border-dashed border-[#e0e0e0] dark:border-[#304a6e] h-full min-h-40 col-span-2">
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

                  {addingAddress && (
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
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) =>
                              setAddressForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
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
                            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0a192f] text-sm font-bold leading-normal hover:opacity-90 disabled:opacity-50 flex shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 border-2 border-primary"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setAddingAddress(false)}
                            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-[#e0e0e0] dark:border-[#304a6e] text-[#5c5c5c] dark:text-[#a8b2d1] text-sm font-bold leading-normal hover:bg-[#f5f5f5] dark:hover:bg-[#1a2332] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
        <footer className="w-full bg-white dark:bg-[#172a46] border-t border-[#e0e0e0] dark:border-[#304a6e] py-12 px-6 md:px-10 mt-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link
                className="flex items-center gap-4 text-[#0a192f] dark:text-[#f5f5dc] mb-4"
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
              <p className="text-[#5c5c5c] dark:text-[#a8b2d1] text-sm">
                Exquisite fashion for the discerning individual.
              </p>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                  Shop
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/products"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/products"
                    >
                      Collections
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/products"
                    >
                      Bags
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/products"
                    >
                      Accessories
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                  About
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/about"
                    >
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/about"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/about"
                    >
                      Press
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                  Support
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/contact"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/contact"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-sm text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                      href="/contact"
                    >
                      Shipping &amp; Returns
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#0a192f] dark:text-[#f5f5dc] mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-4">
                  <a
                    className="text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="#"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"></path>
                    </svg>
                  </a>
                  <a
                    className="text-[#5c5c5c] dark:text-[#a8b2d1] hover:text-primary transition-colors"
                    href="#"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.791 4.649-.69.188-1.433.23-2.184.084.616 1.92 2.344 3.328 4.411 3.365-1.799 1.407-4.069 2.245-6.516 2.245-.425 0-.845-.024-1.258-.074 2.323 1.496 5.078 2.372 8.046 2.372 8.498 0 13.498-7.355 13.298-13.826 1.017-.723 1.898-1.632 2.6-2.705z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#e0e0e0] dark:border-[#304a6e] text-center text-sm text-[#5c5c5c] dark:text-[#a8b2d1]">
            <p>© 2024 Lylux Belladonna. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
