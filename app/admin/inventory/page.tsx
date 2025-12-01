"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { getProducts, updateProduct } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  images: string[];
  status: string;
}

export default function AdminInventory() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "sku">("stock");
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>(
    {}
  );
  const [updatingStock, setUpdatingStock] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    } else {
      loadProducts();
    }
  }, [user, router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts as Product[]);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      setUpdatingStock({ ...updatingStock, [productId]: true });
      await updateProduct(productId, { stock: newStock });

      // Update local state
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, stock: newStock } : p
        )
      );

      // Clear editing state
      const newEditingStock = { ...editingStock };
      delete newEditingStock[productId];
      setEditingStock(newEditingStock);

      alert("Stock updated successfully!");
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock");
    } finally {
      setUpdatingStock({ ...updatingStock, [productId]: false });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === "low-stock") {
      matchesFilter = product.stock <= 10 && product.stock > 0;
    } else if (filter === "out-of-stock") {
      matchesFilter = product.stock === 0;
    } else if (filter === "in-stock") {
      matchesFilter = product.stock > 10;
    }

    return matchesSearch && matchesFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "stock":
        return a.stock - b.stock;
      case "sku":
        return a.sku.localeCompare(b.sku);
      default:
        return 0;
    }
  });

  const lowStockCount = products.filter(
    (p) => p.stock <= 10 && p.stock > 0
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

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
                  Inventory Management
                </h1>
                <p className="text-cream/70 text-sm mt-2">
                  Track stock levels and manage inventory
                </p>
              </div>
              <Link
                href="/admin"
                className="text-cream hover:text-gold transition-colors text-sm font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-cream/70 text-sm">Total Products</p>
                <p className="text-cream text-2xl font-bold">
                  {products.length}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-cream/70 text-sm">Low Stock</p>
                <p className="text-orange-400 text-2xl font-bold">
                  {lowStockCount}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-cream/70 text-sm">Out of Stock</p>
                <p className="text-red-400 text-2xl font-bold">
                  {outOfStockCount}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-cream/70 text-sm">Total Value</p>
                <p className="text-green-400 text-2xl font-bold">
                  ${totalValue.toFixed(0)}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#1a2332]/10 border border-white/20 text-cream placeholder-cream/50 focus:outline-none focus:border-gold"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-[#1a2332]/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
              >
                <option value="all">All Products</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock (≤10)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-[#1a2332]/10 border border-white/20 text-cream focus:outline-none focus:border-gold"
              >
                <option value="stock">Sort by: Stock</option>
                <option value="name">Sort by: Name</option>
                <option value="sku">Sort by: SKU</option>
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-8 text-center">
              <p className="text-cream/70">No products found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-[#1a2332]/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10 border-b border-white/20">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-medium text-cream uppercase tracking-wider">
                          Product
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-cream uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-cream uppercase tracking-wider">
                          Category
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-cream uppercase tracking-wider">
                          Price
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-cream uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-cream uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-cream uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-lg bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${
                                    product.images[0] || "/placeholder.jpg"
                                  })`,
                                }}
                              />
                              <span className="text-cream font-medium">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-cream/80">
                            {product.sku}
                          </td>
                          <td className="py-4 px-6 text-cream/80">
                            {product.category}
                          </td>
                          <td className="py-4 px-6 text-cream font-medium">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            {editingStock[product.id] !== undefined ? (
                              <input
                                type="number"
                                value={editingStock[product.id]}
                                onChange={(e) =>
                                  setEditingStock({
                                    ...editingStock,
                                    [product.id]: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-20 px-2 py-1 rounded bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                                min="0"
                              />
                            ) : (
                              <span
                                className={`font-bold ${
                                  product.stock === 0
                                    ? "text-red-400"
                                    : product.stock <= 10
                                    ? "text-orange-400"
                                    : "text-green-400"
                                }`}
                              >
                                {product.stock}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.stock === 0
                                  ? "bg-red-500/20 text-red-400"
                                  : product.stock <= 10
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {product.stock === 0
                                ? "Out of Stock"
                                : product.stock <= 10
                                ? "Low Stock"
                                : "In Stock"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {editingStock[product.id] !== undefined ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleStockUpdate(
                                      product.id,
                                      editingStock[product.id]
                                    )
                                  }
                                  disabled={updatingStock[product.id]}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium disabled:opacity-50"
                                >
                                  {updatingStock[product.id] ? "..." : "Save"}
                                </button>
                                <button
                                  onClick={() => {
                                    const newEditingStock = { ...editingStock };
                                    delete newEditingStock[product.id];
                                    setEditingStock(newEditingStock);
                                  }}
                                  className="px-3 py-1 bg-[#1a2332]/10 hover:bg-white/20 text-cream rounded text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setEditingStock({
                                    ...editingStock,
                                    [product.id]: product.stock,
                                  })
                                }
                                className="px-3 py-1 bg-gold hover:bg-gold/90 text-navy rounded text-sm font-medium"
                              >
                                Edit Stock
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/5 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `url(${
                            product.images[0] || "/placeholder.jpg"
                          })`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-cream font-bold truncate">
                          {product.name}
                        </h3>
                        <p className="text-cream/70 text-sm">{product.sku}</p>
                        <p className="text-cream font-medium">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          product.stock === 0
                            ? "bg-red-500/20 text-red-400"
                            : product.stock <= 10
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out"
                          : product.stock <= 10
                          ? "Low"
                          : "In Stock"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <p className="text-cream/70 text-xs">Stock Level</p>
                        {editingStock[product.id] !== undefined ? (
                          <input
                            type="number"
                            value={editingStock[product.id]}
                            onChange={(e) =>
                              setEditingStock({
                                ...editingStock,
                                [product.id]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20 px-2 py-1 rounded bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold mt-1"
                            min="0"
                          />
                        ) : (
                          <p
                            className={`font-bold ${
                              product.stock === 0
                                ? "text-red-400"
                                : product.stock <= 10
                                ? "text-orange-400"
                                : "text-green-400"
                            }`}
                          >
                            {product.stock} units
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingStock[product.id] !== undefined ? (
                          <>
                            <button
                              onClick={() =>
                                handleStockUpdate(
                                  product.id,
                                  editingStock[product.id]
                                )
                              }
                              disabled={updatingStock[product.id]}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium disabled:opacity-50"
                            >
                              {updatingStock[product.id] ? "..." : "Save"}
                            </button>
                            <button
                              onClick={() => {
                                const newEditingStock = { ...editingStock };
                                delete newEditingStock[product.id];
                                setEditingStock(newEditingStock);
                              }}
                              className="px-3 py-1 bg-[#1a2332]/10 hover:bg-white/20 text-cream rounded text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              setEditingStock({
                                ...editingStock,
                                [product.id]: product.stock,
                              })
                            }
                            className="px-3 py-1 bg-gold hover:bg-gold/90 text-navy rounded text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

