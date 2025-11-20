"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllReviews,
  updateReview,
  deleteReview,
  getOrders,
  getCustomers,
  getBrands,
  createBrand,
} from "@/lib/firestore";
import { uploadImages, deleteImages } from "@/lib/storage";

type Tab = "dashboard" | "products" | "orders" | "customers" | "reviews";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { userProfile, logout } = useAuth();
  const router = useRouter();
  const toastContext = useToast();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-100 dark:bg-[#0A192F] flex">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-[#1a2332] shadow-lg transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "w-16" : "w-64"
          } fixed left-0 top-0 h-full z-40`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
            {!sidebarCollapsed && (
              <Link
                href="/"
                className="text-xl font-serif font-bold text-primary"
              >
                Lylux Belladonna
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0f1825] transition-colors"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                {sidebarCollapsed ? "menu" : "close"}
              </span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 px-3">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0f1825] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">
                  dashboard
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium">Dashboard</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "products"
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0f1825] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">
                  inventory_2
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium">Products</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "orders"
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0f1825] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">
                  shopping_bag
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium">Orders</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "customers"
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0f1825] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">
                  people
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium">Customers</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "reviews"
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0f1825] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl shrink-0">
                  rate_review
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium">Reviews</span>
                )}
              </button>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <span className="material-symbols-outlined text-xl shrink-0">
                logout
              </span>
              {!sidebarCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* Top Header */}
          <header className="bg-white dark:bg-[#1a2332] shadow-sm sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0f1825] transition-colors"
                >
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                    menu
                  </span>
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {activeTab}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  View Site
                </Link>
                <Link
                  href="/populate-dummy-data"
                  className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-500 font-medium transition-colors"
                >
                  Populate Data
                </Link>
                <Link
                  href="/create-test-user"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium transition-colors"
                >
                  Create Test User
                </Link>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-4 sm:p-6 lg:p-8">
            {activeTab === "dashboard" && <DashboardOverview />}
            {activeTab === "products" && <ProductsManagement />}
            {activeTab === "orders" && <OrdersManagement />}
            {activeTab === "customers" && <CustomersManagement />}
            {activeTab === "reviews" && <ReviewsManagement />}
          </main>
        </div>

        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalReviews: 0,
    loading: true,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [orders, products, customers, reviews] = await Promise.all([
          getOrders(),
          getProducts(),
          getCustomers(),
          getAllReviews(),
        ]);

        // Calculate total revenue from completed orders
        const totalRevenue = orders
          .filter((order: any) => order.paymentStatus === "paid")
          .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        // Calculate statistics
        const totalOrders = orders.length;
        const totalCustomers = customers.length;
        const totalProducts = products.length;
        const totalReviews = reviews.length;

        // Get recent orders (last 5)
        const sortedOrders = orders
          .sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5);

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          totalReviews,
          loading: false,
        });

        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === "paid")
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
    if (status === "processing")
      return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
    if (status === "shipped")
      return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400";
    if (status === "completed")
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
    return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
  };

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                attach_money
              </span>
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            From completed orders
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                shopping_cart
              </span>
            </div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            All time orders
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                group
              </span>
            </div>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
            Registered users
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Products
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalProducts}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">
                inventory
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Active listings
          </p>
        </div>

        <Link
          href="/admin/reviews"
          className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reviews
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalReviews}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">
                rate_review
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Manage customer reviews
          </p>
        </Link>

        <Link
          href="/admin/inventory"
          className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Inventory
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                Manage Stock
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">
                warehouse
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Track stock levels and alerts
          </p>
        </Link>

        <Link
          href="/admin/analytics"
          className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analytics
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                View Reports
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                analytics
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Sales insights and metrics
          </p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 dark:border-white/5"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      #{order.orderNumber || order.id.slice(-8)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {order.shippingAddress?.fullName || order.email || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {order.items?.[0]?.name || "Product"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status,
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus === "paid"
                          ? "Paid"
                          : order.status === "processing"
                          ? "Processing"
                          : order.status === "shipped"
                          ? "Shipped"
                          : order.status === "completed"
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Products Management Component
// Products Management Component
function ProductsManagement() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  // Modal state
  type ModalMode = "create" | "edit" | "view" | null;
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    featured: false,
    sizes: "",
    colors: "",
    brand: "",
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Variant state
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [variantImages, setVariantImages] = useState<{ [key: string]: File[] }>(
    {}
  );
  const [variantImagePreviews, setVariantImagePreviews] = useState<{
    [key: string]: string[];
  }>({});

  // Brand state
  const [brands, setBrands] = useState<any[]>([]);
  const [showNewBrandForm, setShowNewBrandForm] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [newBrandData, setNewBrandData] = useState({
    name: "",
    logo: null as File | null,
    logoPreview: "",
  });

  // Category state
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts as any[]);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  };

  const openModal = (mode: ModalMode, product?: any) => {
    setModalMode(mode);
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        featured: product.featured || false,
        sizes: product.sizes?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        brand: product.brand || "",
      });
      setExistingImages(product.images || []);
      setHasVariants(product.hasVariants || false);
      setVariants(product.variants || []);
    } else {
      resetForm();
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      featured: false,
      sizes: "",
      colors: "",
      brand: "",
    });
    setExistingImages([]);
    setNewImageFiles([]);
    setImagePreviews([]);
    setHasVariants(false);
    setVariants([]);
    setVariantImages({});
    setVariantImagePreviews({});
    setShowNewBrandForm(false);
    setShowBrandDropdown(false);
    setNewBrandData({ name: "", logo: null, logoPreview: "" });
    setShowCategoryDropdown(false);
    setNewCategoryName("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Variant management functions
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `variant-${Date.now()}`,
        name: "",
        options: [
          { id: `option-${Date.now()}`, name: "", price: 0, image: "" },
        ],
      },
    ]);
  };

  const removeVariant = (variantIndex: number) => {
    setVariants(variants.filter((_, i) => i !== variantIndex));
  };

  const updateVariant = (variantIndex: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      [field]: value,
    };
    setVariants(updatedVariants);
  };

  const addVariantOption = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options.push({
      id: `option-${Date.now()}`,
      name: "",
      price: 0,
      image: "",
    });
    setVariants(updatedVariants);
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options = updatedVariants[
      variantIndex
    ].options.filter((_: any, i: number) => i !== optionIndex);
    setVariants(updatedVariants);
  };

  const updateVariantOption = (
    variantIndex: number,
    optionIndex: number,
    field: string,
    value: any
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options[optionIndex] = {
      ...updatedVariants[variantIndex].options[optionIndex],
      [field]: value,
    };
    setVariants(updatedVariants);
  };

  const handleVariantImageSelect = (
    variantIndex: number,
    optionIndex: number,
    files: FileList
  ) => {
    const fileArray = Array.from(files);
    const key = `${variantIndex}-${optionIndex}`;

    setVariantImages((prev) => ({ ...prev, [key]: fileArray }));

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVariantImagePreviews((prev) => ({
          ...prev,
          [key]: [...(prev[key] || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeVariantImage = (
    variantIndex: number,
    optionIndex: number,
    imageIndex: number
  ) => {
    const key = `${variantIndex}-${optionIndex}`;
    setVariantImages((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== imageIndex),
    }));
    setVariantImagePreviews((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== imageIndex),
    }));
  };

  // Brand management functions
  const fetchBrands = async () => {
    try {
      // Assuming there's a getBrands function - if not, we'll need to create it
      const fetchedBrands = await getBrands();
      setBrands(fetchedBrands as any[]);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const handleBrandLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBrandData((prev) => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBrandData((prev) => ({
          ...prev,
          logoPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createNewBrand = async () => {
    if (!newBrandData.name.trim()) {
      addToast("Please enter a brand name", "error");
      return;
    }

    try {
      let logoUrl = "";
      if (newBrandData.logo) {
        const uploadedUrls = await uploadImages(
          [newBrandData.logo],
          `brands/${Date.now()}`
        );
        logoUrl = uploadedUrls[0];
      }

      const brandData = {
        name: newBrandData.name,
        logo: logoUrl,
        createdAt: new Date(),
      };

      // Assuming there's a createBrand function - if not, we'll need to create it
      const newBrand = await createBrand(brandData);

      setBrands((prev) => [...prev, newBrand]);
      setFormData((prev) => ({ ...prev, brand: newBrand.id }));
      setShowNewBrandForm(false);
      setNewBrandData({ name: "", logo: null, logoPreview: "" });
      addToast("Brand created successfully!", "success");
    } catch (err) {
      console.error("Error creating brand:", err);
      addToast("Failed to create brand. Please try again.", "error");
    }
  };

  // Category management functions
  const fetchCategories = async () => {
    try {
      const fetchedProducts = await getProducts();
      const uniqueCategories = Array.from(
        new Set(fetchedProducts.map((p: any) => p.category))
      ).filter(Boolean);
      setAvailableCategories(uniqueCategories as string[]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const createNewCategory = () => {
    if (!newCategoryName.trim()) {
      addToast("Please enter a category name", "error");
      return;
    }

    // Add to available categories
    setAvailableCategories((prev) => [...prev, newCategoryName.trim()]);
    setFormData((prev) => ({ ...prev, category: newCategoryName.trim() }));
    setShowCategoryDropdown(false);
    setNewCategoryName("");
    addToast("Category added successfully!", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let uploadedImageUrls: string[] = [];
      if (newImageFiles.length > 0) {
        const productId = selectedProduct?.id || `temp-${Date.now()}`;
        uploadedImageUrls = await uploadImages(
          newImageFiles,
          `products/${productId}`
        );
      }

      const allImages = [...existingImages, ...uploadedImageUrls];

      // Process variant images
      const processedVariants = await Promise.all(
        variants.map(async (variant, variantIndex) => {
          const processedOptions = await Promise.all(
            variant.options.map(async (option: any, optionIndex: number) => {
              let optionImageUrl = option.image || "";
              const key = `${variantIndex}-${optionIndex}`;
              const variantFiles = variantImages[key] || [];

              if (variantFiles.length > 0) {
                const productId = selectedProduct?.id || `temp-${Date.now()}`;
                const uploadedUrls = await uploadImages(
                  variantFiles,
                  `products/${productId}/variants/${variant.id}/${option.id}`
                );
                optionImageUrl = uploadedUrls[0] || optionImageUrl;
              }

              return {
                ...option,
                image: optionImageUrl,
              };
            })
          );

          return {
            ...variant,
            options: processedOptions,
          };
        })
      );

      const productData = hasVariants
        ? {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            brand: formData.brand,
            featured: formData.featured,
            images: allImages,
            hasVariants: true,
            variants: processedVariants,
            // For variant products, base price and stock are not used
            price: 0,
            stock: 0,
          }
        : {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            category: formData.category,
            brand: formData.brand,
            stock: Number(formData.stock),
            featured: formData.featured,
            images: allImages,
            hasVariants: false,
            variants: [],
            sizes: formData.sizes
              ? formData.sizes
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
            colors: formData.colors
              ? formData.colors
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean)
              : [],
          };

      if (modalMode === "create") {
        await createProduct(productData);
        addToast("Product created successfully!", "success");
      } else if (modalMode === "edit" && selectedProduct) {
        const removedImages = (selectedProduct.images || []).filter(
          (img: string) => !existingImages.includes(img)
        );
        if (removedImages.length > 0) {
          await deleteImages(removedImages);
        }

        await updateProduct(selectedProduct.id, productData);
        addToast("Product updated successfully!", "success");
      }

      await fetchProducts();
      closeModal();
    } catch (err) {
      console.error("Error saving product:", err);
      addToast("Failed to save product. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: any) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      setSaving(true);
      if (product.images && product.images.length > 0) {
        await deleteImages(product.images);
      }
      await deleteProduct(product.id);
      addToast("Product deleted successfully!", "success");
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      addToast("Failed to delete product. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    "all",
    ...Array.from(
      new Set([...products.map((p) => p.category), ...availableCategories])
    ),
  ];

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Product Management
        </h2>
        <button
          onClick={() => openModal("create")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pl-10 bg-white dark:bg-[#1a2332] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
              search
            </span>
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-[#1a2332] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1a2332] rounded-lg">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
            inventory_2
          </span>
          <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">
            No products found
          </p>
          <button
            onClick={() => openModal("create")}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Create Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-gray-400">
                      image
                    </span>
                  </div>
                )}
                {product.featured && (
                  <span className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Price/Variant Info */}
                <div className="mb-3">
                  {product.hasVariants ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded text-xs font-medium">
                          {product.variants?.length || 0} Variant
                          {product.variants?.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {product.variants?.reduce(
                            (total: number, variant: any) =>
                              total + (variant.options?.length || 0),
                            0
                          ) || 0}{" "}
                          Options
                        </span>
                      </div>
                      {product.variants && product.variants.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {product.variants
                            .slice(0, 2)
                            .map((variant: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  chevron_right
                                </span>
                                <span className="font-medium">
                                  {variant.name}:
                                </span>
                                <span>
                                  {variant.options?.length || 0} options
                                </span>
                              </div>
                            ))}
                          {product.variants.length > 2 && (
                            <div className="text-xs text-gray-500 italic">
                              +{product.variants.length - 2} more...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        ${product.price?.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Stock: {product.stock}
                      </span>
                    </div>
                  )}
                </div>

                {/* Category & Brand */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded flex items-center gap-1">
                      {brands.find((b) => b.id === product.brand)?.logo && (
                        <Image
                          src={brands.find((b) => b.id === product.brand)?.logo}
                          alt="Brand logo"
                          width={14}
                          height={14}
                          className="object-contain rounded"
                        />
                      )}
                      {brands.find((b) => b.id === product.brand)?.name ||
                        product.brand}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal("view", product)}
                    className="flex-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#0f1825] hover:bg-gray-200 dark:hover:bg-[#1a2332] rounded-lg transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openModal("edit", product)}
                    className="flex-1 px-3 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={saving}
                    className="flex-1 px-3 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500/75 transition-opacity"
              onClick={closeModal}
            ></div>

            {/* Modal Content */}
            <div className="relative inline-block w-full max-w-4xl transform overflow-hidden rounded-lg bg-white dark:bg-[#1a2332] text-left align-middle shadow-xl transition-all">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {modalMode === "create" && "Create New Product"}
                    {modalMode === "edit" && "Edit Product"}
                    {modalMode === "view" && "Product Details"}
                  </h3>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      close
                    </span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          disabled={modalMode === "view"}
                          required
                          className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category *
                        </label>
                        <div className="relative">
                          {/* Custom Category Dropdown */}
                          <div
                            className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer flex items-center justify-between"
                            onClick={() =>
                              setShowCategoryDropdown(!showCategoryDropdown)
                            }
                          >
                            <span>
                              {formData.category || "Select a category"}
                            </span>
                            <span className="material-symbols-outlined text-gray-400">
                              {showCategoryDropdown
                                ? "expand_less"
                                : "expand_more"}
                            </span>
                          </div>

                          {/* Dropdown Options */}
                          {showCategoryDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1a2332] border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              <div
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#0f1825] cursor-pointer text-gray-900 dark:text-white"
                                onClick={() => {
                                  setFormData({ ...formData, category: "" });
                                  setShowCategoryDropdown(false);
                                }}
                              >
                                Select a category
                              </div>
                              {availableCategories.map((category) => (
                                <div
                                  key={category}
                                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#0f1825] cursor-pointer text-gray-900 dark:text-white"
                                  onClick={() => {
                                    setFormData({ ...formData, category });
                                    setShowCategoryDropdown(false);
                                  }}
                                >
                                  {category}
                                </div>
                              ))}
                              <div className="border-t border-gray-200 dark:border-gray-600 p-3">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) =>
                                      setNewCategoryName(e.target.value)
                                    }
                                    placeholder="New category name"
                                    className="flex-1 px-3 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        createNewCategory();
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={createNewCategory}
                                    className="px-3 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-opacity-90 transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Brand Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brand
                      </label>
                      <div className="relative">
                        {/* Custom Brand Dropdown */}
                        <div
                          className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer flex items-center justify-between"
                          onClick={() =>
                            setShowBrandDropdown(!showBrandDropdown)
                          }
                        >
                          <div className="flex items-center gap-3">
                            {formData.brand &&
                              brands.find((b) => b.id === formData.brand)
                                ?.logo && (
                                <Image
                                  src={
                                    brands.find((b) => b.id === formData.brand)
                                      ?.logo
                                  }
                                  alt="Selected brand"
                                  width={24}
                                  height={24}
                                  className="object-contain rounded"
                                />
                              )}
                            <span>
                              {formData.brand
                                ? brands.find((b) => b.id === formData.brand)
                                    ?.name || "Unknown Brand"
                                : "Select a brand (optional)"}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-gray-400">
                            {showBrandDropdown ? "expand_less" : "expand_more"}
                          </span>
                        </div>

                        {/* Dropdown Options */}
                        {showBrandDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1a2332] border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#0f1825] cursor-pointer text-gray-900 dark:text-white"
                              onClick={() => {
                                setFormData({ ...formData, brand: "" });
                                setShowBrandDropdown(false);
                              }}
                            >
                              Select a brand (optional)
                            </div>
                            {brands.map((brand) => (
                              <div
                                key={brand.id}
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#0f1825] cursor-pointer text-gray-900 dark:text-white flex items-center gap-3"
                                onClick={() => {
                                  setFormData({ ...formData, brand: brand.id });
                                  setShowBrandDropdown(false);
                                }}
                              >
                                {brand.logo && (
                                  <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={24}
                                    height={24}
                                    className="object-contain rounded"
                                  />
                                )}
                                <span>{brand.name}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 dark:border-gray-600">
                              <div
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#0f1825] cursor-pointer text-primary flex items-center gap-2"
                                onClick={() => {
                                  setShowBrandDropdown(false);
                                  setShowNewBrandForm(true);
                                }}
                              >
                                <span className="material-symbols-outlined text-lg">
                                  add
                                </span>
                                Create New Brand
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* New Brand Form */}
                      {showNewBrandForm && (
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-[#0f1825]">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Create New Brand
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Brand Name *
                              </label>
                              <input
                                type="text"
                                value={newBrandData.name}
                                onChange={(e) =>
                                  setNewBrandData({
                                    ...newBrandData,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Enter brand name"
                                required
                                className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Brand Logo
                              </label>
                              <div className="flex items-center gap-4">
                                {newBrandData.logoPreview && (
                                  <Image
                                    src={newBrandData.logoPreview}
                                    alt="Brand logo preview"
                                    width={80}
                                    height={80}
                                    className="object-contain rounded"
                                  />
                                )}
                                <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {newBrandData.logo
                                      ? "Change logo"
                                      : "Upload logo"}
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBrandLogoSelect}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={createNewBrand}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-opacity-90 transition-colors"
                              >
                                Create Brand
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowNewBrandForm(false);
                                  setNewBrandData({
                                    name: "",
                                    logo: null,
                                    logoPreview: "",
                                  });
                                }}
                                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        disabled={modalMode === "view"}
                        required
                        rows={4}
                        className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>

                    {/* Product Type Toggle */}
                    {modalMode !== "view" && (
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              Product Type
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Choose whether this product has multiple variants
                              or is a simple product
                            </p>
                          </div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Has Variants
                            </span>
                            <input
                              type="checkbox"
                              checked={hasVariants}
                              onChange={(e) => setHasVariants(e.target.checked)}
                              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Simple Product Fields */}
                    {!hasVariants && (
                      <>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Price ($) *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  price: Number(e.target.value),
                                })
                              }
                              disabled={modalMode === "view"}
                              required
                              className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Stock *
                            </label>
                            <input
                              type="number"
                              value={formData.stock}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  stock: Number(e.target.value),
                                })
                              }
                              disabled={modalMode === "view"}
                              required
                              className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    featured: e.target.checked,
                                  })
                                }
                                disabled={modalMode === "view"}
                                className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Featured Product
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Available Sizes (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={formData.sizes}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  sizes: e.target.value,
                                })
                              }
                              disabled={modalMode === "view"}
                              placeholder="e.g., XS, S, M, L, XL"
                              className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Available Colors (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={formData.colors}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  colors: e.target.value,
                                })
                              }
                              disabled={modalMode === "view"}
                              placeholder="e.g., Black, White, Red"
                              className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Variant Product Fields */}
                    {hasVariants && modalMode !== "view" && (
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            Product Variants
                          </h4>
                          <button
                            type="button"
                            onClick={addVariant}
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm mr-1">
                              add
                            </span>
                            Add Variant
                          </button>
                        </div>

                        {variants.length === 0 ? (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <span className="material-symbols-outlined text-4xl mb-2">
                              inventory_2
                            </span>
                            <p>
                              No variants added yet. Click "Add Variant" to get
                              started.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {variants.map((variant, variantIndex) => (
                              <div
                                key={variant.id}
                                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex-1 mr-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Variant Name *
                                    </label>
                                    <input
                                      type="text"
                                      value={variant.name}
                                      onChange={(e) =>
                                        updateVariant(
                                          variantIndex,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g., Sizes, Colors, Style"
                                      required
                                      className="w-full px-4 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(variantIndex)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  >
                                    <span className="material-symbols-outlined">
                                      delete
                                    </span>
                                  </button>
                                </div>

                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="text-md font-medium text-gray-900 dark:text-white">
                                      Variant Options
                                    </h5>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addVariantOption(variantIndex)
                                      }
                                      className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm mr-1">
                                        add
                                      </span>
                                      Add Option
                                    </button>
                                  </div>

                                  <div className="space-y-3">
                                    {variant.options.map(
                                      (option: any, optionIndex: number) => (
                                        <div
                                          key={option.id}
                                          className="border border-gray-200 dark:border-gray-600 rounded p-3"
                                        >
                                          <div className="grid md:grid-cols-4 gap-3 mb-3">
                                            <div>
                                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Option Name *
                                              </label>
                                              <input
                                                type="text"
                                                value={option.name}
                                                onChange={(e) =>
                                                  updateVariantOption(
                                                    variantIndex,
                                                    optionIndex,
                                                    "name",
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="e.g., S, M, L"
                                                required
                                                className="w-full px-3 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Price ($) *
                                              </label>
                                              <input
                                                type="number"
                                                step="0.01"
                                                value={option.price}
                                                onChange={(e) =>
                                                  updateVariantOption(
                                                    variantIndex,
                                                    optionIndex,
                                                    "price",
                                                    Number(e.target.value)
                                                  )
                                                }
                                                placeholder="0.00"
                                                required
                                                className="w-full px-3 py-2 bg-white dark:bg-[#0f1825] border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                              />
                                            </div>
                                            <div className="md:col-span-2">
                                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Image (Optional)
                                              </label>
                                              <div className="flex gap-2">
                                                <label className="flex-1 flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:border-primary transition-colors">
                                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {variantImagePreviews[
                                                      `${variantIndex}-${optionIndex}`
                                                    ]?.length
                                                      ? `${
                                                          variantImagePreviews[
                                                            `${variantIndex}-${optionIndex}`
                                                          ].length
                                                        } image(s) selected`
                                                      : "Click to upload"}
                                                  </span>
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                      e.target.files &&
                                                      handleVariantImageSelect(
                                                        variantIndex,
                                                        optionIndex,
                                                        e.target.files
                                                      )
                                                    }
                                                    className="hidden"
                                                  />
                                                </label>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    removeVariantOption(
                                                      variantIndex,
                                                      optionIndex
                                                    )
                                                  }
                                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                >
                                                  <span className="material-symbols-outlined text-sm">
                                                    delete
                                                  </span>
                                                </button>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Variant Option Image Previews */}
                                          {variantImagePreviews[
                                            `${variantIndex}-${optionIndex}`
                                          ]?.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 mt-2">
                                              {variantImagePreviews[
                                                `${variantIndex}-${optionIndex}`
                                              ].map((preview, imageIndex) => (
                                                <div
                                                  key={imageIndex}
                                                  className="relative group"
                                                >
                                                  <img
                                                    src={preview}
                                                    alt={`Preview ${
                                                      imageIndex + 1
                                                    }`}
                                                    className="w-full h-16 object-cover rounded"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeVariantImage(
                                                        variantIndex,
                                                        optionIndex,
                                                        imageIndex
                                                      )
                                                    }
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                  >
                                                    <span className="material-symbols-outlined text-xs">
                                                      close
                                                    </span>
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Featured checkbox for variant products */}
                    {hasVariants && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              featured: e.target.checked,
                            })
                          }
                          disabled={modalMode === "view"}
                          className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured Product
                        </span>
                      </div>
                    )}

                    {/* View Brand Information */}
                    {modalMode === "view" && selectedProduct?.brand && (
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Brand Information
                        </h4>
                        <div className="flex items-center gap-3">
                          {brands.find((b) => b.id === selectedProduct.brand)
                            ?.logo && (
                            <Image
                              src={
                                brands.find(
                                  (b) => b.id === selectedProduct.brand
                                )?.logo
                              }
                              alt="Brand logo"
                              width={48}
                              height={48}
                              className="object-contain rounded"
                            />
                          )}
                          <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                              {brands.find(
                                (b) => b.id === selectedProduct.brand
                              )?.name || selectedProduct.brand}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* View Variant Information */}
                    {modalMode === "view" && selectedProduct?.hasVariants && (
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          Product Variants
                        </h4>
                        <div className="space-y-4">
                          {selectedProduct.variants?.map(
                            (variant: any, variantIndex: number) => (
                              <div
                                key={variant.id}
                                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                              >
                                <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                                  {variant.name}
                                </h5>
                                <div className="grid gap-3">
                                  {variant.options?.map(
                                    (option: any, optionIndex: number) => (
                                      <div
                                        key={option.id}
                                        className="flex items-center justify-between bg-gray-50 dark:bg-[#0f1825] rounded p-3"
                                      >
                                        <div className="flex items-center gap-3">
                                          {option.image && (
                                            <Image
                                              src={option.image}
                                              alt={option.name}
                                              width={40}
                                              height={40}
                                              className="object-cover rounded"
                                            />
                                          )}
                                          <div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                              {option.name}
                                            </span>
                                          </div>
                                        </div>
                                        <span className="text-lg font-bold text-primary">
                                          ${option.price?.toFixed(2)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Images
                      </label>

                      {existingImages.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Current Images:
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {existingImages.map((img, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={img}
                                  alt={`Product ${index + 1}`}
                                  width={150}
                                  height={150}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                {modalMode !== "view" && (
                                  <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <span className="material-symbols-outlined text-sm">
                                      close
                                    </span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {imagePreviews.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            New Images:
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeNewImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    close
                                  </span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {modalMode !== "view" && (
                        <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <div className="text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">
                              cloud_upload
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Click to upload images
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#0f1825] hover:bg-gray-200 dark:hover:bg-[#1a2332] rounded-lg font-medium transition-colors"
                  >
                    {modalMode === "view" ? "Close" : "Cancel"}
                  </button>
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {saving
                        ? "Saving..."
                        : modalMode === "create"
                        ? "Create Product"
                        : "Update Product"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Orders Management Component
function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders as any[]);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "shipped":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      default:
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "failed":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700";
      case "refunded":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Order Management
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-[#1a2332] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0f1623] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order ID
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Product
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Payment Status
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                      #{order.orderNumber || order.id.substring(0, 8)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 dark:text-white">
                      {order.email || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {order.items?.[0]?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        defaultValue={order.status || "pending"}
                        disabled={order.paymentStatus !== "paid"}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                          order.paymentStatus === "paid"
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        } appearance-none ${getStatusColor(
                          order.status || "pending"
                        )}`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: "right 0.5rem center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "1.5em 1.5em",
                          paddingRight: "2.5rem",
                        }}
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Completed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${getPaymentStatusColor(
                          order.paymentStatus || "pending"
                        )}`}
                      >
                        {order.paymentStatus
                          ? order.paymentStatus.charAt(0).toUpperCase() +
                            order.paymentStatus.slice(1)
                          : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                        <span className="material-symbols-outlined text-lg">
                          visibility
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1a2332] rounded-lg">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
              shopping_bag
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">
              No orders found
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Order ID
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    #{order.orderNumber || order.id.substring(0, 8)}
                  </p>
                </div>
                <select
                  defaultValue={order.status || "pending"}
                  disabled={order.paymentStatus !== "paid"}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                    order.paymentStatus === "paid"
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  } appearance-none ${getStatusColor(
                    order.status || "pending"
                  )}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customer
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {order.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Product
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {order.items?.[0]?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Payment Status
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPaymentStatusColor(
                      order.paymentStatus || "pending"
                    )}`}
                  >
                    {order.paymentStatus
                      ? order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)
                      : "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-white/10">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Amount
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${order.total?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Date
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <button className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    visibility
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Customers Management Component
function CustomersManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerStats, setCustomerStats] = useState<Map<string, any>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const fetchedCustomers = await getCustomers();
      setCustomers(fetchedCustomers as any[]);

      // Calculate stats for each customer
      const allOrders = await getOrders();
      const stats = new Map<string, any>();

      fetchedCustomers.forEach((customer) => {
        const customerOrders = (allOrders as any[]).filter(
          (order: any) => order.userId === customer.id
        );

        const totalSpent = customerOrders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );

        const lastOrder = customerOrders[0]; // Orders are sorted by date desc

        stats.set(customer.id, {
          orderCount: customerOrders.length,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt?.toDate
            ? lastOrder.createdAt.toDate()
            : undefined,
        });
      });

      setCustomerStats(stats);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Customer Management
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-[#1a2332] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0f1623] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Orders
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Spent
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Joined
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const stats = customerStats.get(customer.id);
                  return (
                    <tr
                      key={customer.uid}
                      className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                            {(customer.displayName || customer.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.displayName || "Anonymous"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {customer.email}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 dark:text-white">
                        {stats?.orderCount || 0}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                        ${(stats?.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            (stats?.orderCount || 0) >= 5
                              ? "bg-primary/20 text-primary"
                              : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                          }`}
                        >
                          {(stats?.orderCount || 0) >= 5 ? "VIP" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                            <span className="material-symbols-outlined text-lg">
                              visibility
                            </span>
                          </button>
                          <button className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded">
                            <span className="material-symbols-outlined text-lg">
                              mail
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1a2332] rounded-lg">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
              group
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">
              No customers found
            </p>
          </div>
        ) : (
          customers.map((customer) => {
            const stats = customerStats.get(customer.uid);
            return (
              <div
                key={customer.uid}
                className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-lg shrink-0">
                    {(customer.displayName || customer.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {customer.displayName || "Anonymous"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {customer.email}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ${
                      (stats?.orderCount || 0) >= 5
                        ? "bg-primary/20 text-primary"
                        : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    }`}
                  >
                    {(stats?.orderCount || 0) >= 5 ? "VIP" : "Active"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Orders
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {stats?.orderCount || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Spent
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      ${(stats?.totalSpent || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Joined
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-white/10">
                  <button className="flex-1 px-3 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors">
                    <span className="material-symbols-outlined text-base mr-1 align-middle">
                      visibility
                    </span>
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                    <span className="material-symbols-outlined text-base mr-1 align-middle">
                      mail
                    </span>
                    Email
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Reviews Management Component
function ReviewsManagement() {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const fetchedReviews = await getAllReviews();
      setReviews(fetchedReviews as any[]);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateReview(id, { status: "approved" });
      addToast("Review approved!", "success");
      loadReviews();
    } catch (error) {
      console.error("Error approving review:", error);
      addToast("Failed to approve review", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateReview(id, { status: "rejected" });
      addToast("Review rejected!", "success");
      loadReviews();
    } catch (error) {
      console.error("Error rejecting review:", error);
      addToast("Failed to reject review", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(id);
      addToast("Review deleted!", "success");
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      addToast("Failed to delete review", "error");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter = filter === "all" || review.status === filter;
    const matchesSearch =
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Review Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Moderate and manage customer reviews
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-[#1a2332] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#1a2332] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1a2332] p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total</p>
            <p className="text-gray-900 dark:text-white text-2xl font-bold">
              {reviews.length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2332] p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
            <p className="text-orange-600 text-2xl font-bold">
              {reviews.filter((r) => r.status === "pending").length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2332] p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Approved</p>
            <p className="text-green-600 text-2xl font-bold">
              {reviews.filter((r) => r.status === "approved").length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2332] p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Rejected</p>
            <p className="text-red-600 text-2xl font-bold">
              {reviews.filter((r) => r.status === "rejected").length}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-[#1a2332] rounded-lg p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
            rate_review
          </span>
          <p className="text-gray-500 dark:text-gray-400 text-xl">
            No reviews found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-[#1a2332] rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Review Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/20 text-primary flex items-center justify-center rounded-full w-10 h-10 font-bold uppercase">
                      {review.userName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold">
                        {review.userName || "Anonymous"}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-sm"
                              style={{
                                fontVariationSettings:
                                  i < (review.rating || 0)
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {review.createdAt?.toDate?.()?.toLocaleDateString() ||
                            "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Product ID: {review.productId}</span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        review.status === "approved"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                          : review.status === "rejected"
                          ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                          : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                      }`}
                    >
                      {review.status || "pending"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  {review.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {review.status !== "rejected" && (
                    <button
                      onClick={() => handleReject(review.id)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
