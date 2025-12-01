"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { getOrders, getProducts, getCustomers } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: any;
  items: any[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sku?: string;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "7days" | "30days" | "90days" | "all"
  >("30days");

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    } else {
      loadData();
    }
  }, [user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedOrders, fetchedProducts, fetchedCustomers] =
        await Promise.all([getOrders(), getProducts(), getCustomers()]);
      setOrders(fetchedOrders as Order[]);
      setProducts(fetchedProducts as Product[]);
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by time range
  const getFilteredOrders = () => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case "7days":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case "all":
        return orders;
    }

    return orders.filter((order) => {
      const orderDate =
        order.createdAt?.toDate?.() || new Date(order.createdAt);
      return orderDate >= cutoffDate;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Calculate metrics
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completedOrders = filteredOrders.filter(
    (o) => o.status === "delivered"
  ).length;
  const conversionRate =
    totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Sales by status
  const ordersByStatus = {
    pending: filteredOrders.filter((o) => o.status === "pending").length,
    processing: filteredOrders.filter((o) => o.status === "processing").length,
    shipped: filteredOrders.filter((o) => o.status === "shipped").length,
    delivered: filteredOrders.filter((o) => o.status === "delivered").length,
    cancelled: filteredOrders.filter((o) => o.status === "cancelled").length,
  };

  // Top products by revenue
  const productSales = new Map<
    string,
    { name: string; revenue: number; quantity: number }
  >();

  filteredOrders.forEach((order) => {
    order.items?.forEach((item: any) => {
      const existing = productSales.get(item.productId) || {
        name: item.name,
        revenue: 0,
        quantity: 0,
      };
      productSales.set(item.productId, {
        name: item.name,
        revenue: existing.revenue + item.price * item.quantity,
        quantity: existing.quantity + item.quantity,
      });
    });
  });

  const topProducts = Array.from(productSales.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Sales by category
  const categorySales = new Map<string, number>();

  filteredOrders.forEach((order) => {
    order.items?.forEach((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const existing = categorySales.get(product.category) || 0;
        categorySales.set(
          product.category,
          existing + item.price * item.quantity
        );
      }
    });
  });

  const topCategories = Array.from(categorySales.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Low stock products
  const lowStockProducts = products
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  if (!user) {
    return null;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-navy group/design-root overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <div className="px-4 sm:px-10 py-8">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display text-4xl font-bold text-cream">
                  Analytics & Reports
                </h1>
                <p className="text-cream/70 text-sm mt-2">
                  Track sales performance and business insights
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-2 rounded-lg bg-[#1a2332]/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg bg-[#1a2332]/10 text-cream hover:bg-white/20 transition-colors font-medium"
                >
                  ← Back
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-cream/70 text-sm">Total Revenue</p>
                    <span className="material-symbols-outlined text-green-400">
                      trending_up
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-cream">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-green-400 text-xs mt-2">
                    {totalOrders} orders
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-cream/70 text-sm">Avg Order Value</p>
                    <span className="material-symbols-outlined text-blue-400">
                      shopping_cart
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-cream">
                    ${averageOrderValue.toFixed(2)}
                  </p>
                  <p className="text-blue-400 text-xs mt-2">Per transaction</p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-cream/70 text-sm">Conversion Rate</p>
                    <span className="material-symbols-outlined text-purple-400">
                      percent
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-cream">
                    {conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-purple-400 text-xs mt-2">
                    {completedOrders} completed
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-cream/70 text-sm">Total Customers</p>
                    <span className="material-symbols-outlined text-orange-400">
                      group
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-cream">
                    {customers.length}
                  </p>
                  <p className="text-orange-400 text-xs mt-2">
                    Registered users
                  </p>
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="bg-white/5 rounded-xl p-6">
                <h2 className="text-xl font-bold text-cream mb-6">
                  Order Status Distribution
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="bg-yellow-500/20 text-yellow-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
                      {ordersByStatus.pending}
                    </div>
                    <p className="text-cream/70 text-sm">Pending</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500/20 text-blue-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
                      {ordersByStatus.processing}
                    </div>
                    <p className="text-cream/70 text-sm">Processing</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500/20 text-purple-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
                      {ordersByStatus.shipped}
                    </div>
                    <p className="text-cream/70 text-sm">Shipped</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-500/20 text-green-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
                      {ordersByStatus.delivered}
                    </div>
                    <p className="text-cream/70 text-sm">Delivered</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-500/20 text-red-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-2xl font-bold mb-2">
                      {ordersByStatus.cancelled}
                    </div>
                    <p className="text-cream/70 text-sm">Cancelled</p>
                  </div>
                </div>
              </div>

              {/* Top Products & Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-cream mb-6">
                    Top Products by Revenue
                  </h2>
                  {topProducts.length === 0 ? (
                    <p className="text-cream/50 text-center py-8">
                      No data available
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-[#1a2332]/5 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-gold text-navy w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-cream font-medium">
                                {product.name}
                              </p>
                              <p className="text-cream/50 text-xs">
                                {product.quantity} sold
                              </p>
                            </div>
                          </div>
                          <p className="text-green-400 font-bold">
                            ${product.revenue.toFixed(0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top Categories */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-cream mb-6">
                    Top Categories
                  </h2>
                  {topCategories.length === 0 ? (
                    <p className="text-cream/50 text-center py-8">
                      No data available
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {topCategories.map((cat, index) => (
                        <div key={cat.category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-cream font-medium">
                              {cat.category}
                            </p>
                            <p className="text-gold font-bold">
                              ${cat.revenue.toFixed(0)}
                            </p>
                          </div>
                          <div className="w-full bg-[#1a2332]/10 rounded-full h-2">
                            <div
                              className="bg-gold h-2 rounded-full transition-all"
                              style={{
                                width: `${
                                  (cat.revenue /
                                    Math.max(
                                      ...topCategories.map((c) => c.revenue)
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Alert */}
              {lowStockProducts.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-red-400 text-3xl">
                      warning
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-red-400">
                        Low Stock Alert
                      </h2>
                      <p className="text-cream/70 text-sm">
                        {lowStockProducts.length} products need restocking
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-cream font-medium">
                            {product.name}
                          </p>
                          <p className="text-cream/50 text-xs">{product.sku}</p>
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            product.stock === 0
                              ? "text-red-400"
                              : "text-orange-400"
                          }`}
                        >
                          {product.stock}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/admin/inventory"
                    className="mt-4 inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium text-sm"
                  >
                    Manage Inventory
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/admin/orders"
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-colors group"
                >
                  <span className="material-symbols-outlined text-4xl text-gold mb-2 block group-hover:scale-110 transition-transform">
                    receipt_long
                  </span>
                  <p className="text-cream font-medium">View Orders</p>
                </Link>
                <Link
                  href="/admin/products"
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-colors group"
                >
                  <span className="material-symbols-outlined text-4xl text-gold mb-2 block group-hover:scale-110 transition-transform">
                    inventory_2
                  </span>
                  <p className="text-cream font-medium">Manage Products</p>
                </Link>
                <Link
                  href="/admin/customers"
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-colors group"
                >
                  <span className="material-symbols-outlined text-4xl text-gold mb-2 block group-hover:scale-110 transition-transform">
                    group
                  </span>
                  <p className="text-cream font-medium">View Customers</p>
                </Link>
                <Link
                  href="/admin/inventory"
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-6 text-center transition-colors group"
                >
                  <span className="material-symbols-outlined text-4xl text-gold mb-2 block group-hover:scale-110 transition-transform">
                    warehouse
                  </span>
                  <p className="text-cream font-medium">Check Inventory</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

