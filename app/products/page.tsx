"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getProducts } from "@/lib/firestore";
import { orderBy } from "firebase/firestore";
import { useCurrency } from "@/lib/currency-context";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  status: string;
  sku: string;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<
    "newest" | "price-asc" | "price-desc" | "popular"
  >("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts([orderBy("createdAt", "desc")]);
      setProducts(fetchedProducts as Product[]);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    // Subcategory filter
    if (
      selectedSubcategories.length > 0 &&
      !selectedSubcategories.includes(product.subcategory)
    ) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Stock filter
    if (inStockOnly && product.stock === 0) {
      return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "popular":
        return b.rating - a.rating;
      case "newest":
      default:
        return 0;
    }
  });

  // Get unique categories and subcategories
  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const subcategories = Array.from(
    new Set(
      products
        .filter(
          (p) => selectedCategory === "all" || p.category === selectedCategory
        )
        .map((p) => p.subcategory)
    )
  );

  // Clear filters
  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedSubcategories([]);
    setSearchQuery("");
    setPriceRange([0, 10000]);
    setInStockOnly(false);
  };

  // Count active filters
  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedSubcategories.length +
    (searchQuery ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <Header />
      <div className="layout-container flex h-full grow flex-col">
        <div className="w-full flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[1280px] flex-1">
            <main className="flex flex-col gap-6 px-4 md:px-6 lg:px-8 py-8">
              {/* Breadcrumbs */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="text-gold/80 text-sm font-medium leading-normal hover:text-gold"
                    href="/"
                  >
                    Home
                  </Link>
                  <span className="text-gold/50 text-sm font-medium leading-normal">
                    /
                  </span>
                  <span className="text-cream text-sm font-medium leading-normal">
                    Products
                  </span>
                </div>
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-cream text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
                    Belladonna Collections
                  </p>
                  <p className="text-cream/70 text-base font-normal leading-normal">
                    Discover the latest in high-end fashion, curated just for
                    you.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-white/5 border border-white/20 text-cream placeholder-cream/50 focus:outline-none focus:border-gold transition-colors"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-cream/50">
                  search
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubcategories([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-gold text-navy"
                        : "bg-white/5 text-cream hover:bg-white/10"
                    }`}
                  >
                    {category === "all" ? "All Products" : category}
                  </button>
                ))}
              </div>

              {/* Filter and Sort Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-solid border-gold/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 cursor-pointer rounded-lg h-10 px-4 text-cream bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold relative"
                  >
                    <span className="material-symbols-outlined text-base">
                      filter_list
                    </span>
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-cream/70 hover:text-cream text-sm underline"
                    >
                      Clear all
                    </button>
                  )}
                  <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md ${
                        viewMode === "grid"
                          ? "text-cream bg-white/10"
                          : "text-cream/70 hover:text-cream"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        grid_view
                      </span>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md ${
                        viewMode === "list"
                          ? "text-cream bg-white/10"
                          : "text-cream/70 hover:text-cream"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        view_agenda
                      </span>
                    </button>
                  </div>
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gold text-navy gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4 pr-10 hover:opacity-90 transition-opacity appearance-none w-full"
                  >
                    <option value="newest">Sort by: Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <span className="material-symbols-outlined text-base absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="bg-white/5 rounded-lg p-6 space-y-6 border border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-cream font-bold text-lg">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-cream/70 hover:text-cream"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  {/* Subcategory Filter */}
                  {subcategories.length > 0 && (
                    <div>
                      <h4 className="text-cream font-medium text-sm mb-3 uppercase tracking-wider">
                        Subcategory
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {subcategories.map((subcategory) => (
                          <button
                            key={subcategory}
                            onClick={() => {
                              if (selectedSubcategories.includes(subcategory)) {
                                setSelectedSubcategories(
                                  selectedSubcategories.filter(
                                    (s) => s !== subcategory
                                  )
                                );
                              } else {
                                setSelectedSubcategories([
                                  ...selectedSubcategories,
                                  subcategory,
                                ]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selectedSubcategories.includes(subcategory)
                                ? "bg-gold text-navy"
                                : "bg-white/10 text-cream hover:bg-white/20"
                            }`}
                          >
                            {subcategory}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range Filter */}
                  <div>
                    <h4 className="text-cream font-medium text-sm mb-3 uppercase tracking-wider">
                      Price Range
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              parseInt(e.target.value) || 0,
                              priceRange[1],
                            ])
                          }
                          placeholder="Min"
                          className="flex-1 px-3 py-2 rounded-lg bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                        />
                        <span className="text-cream/50">to</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              parseInt(e.target.value) || 10000,
                            ])
                          }
                          placeholder="Max"
                          className="flex-1 px-3 py-2 rounded-lg bg-navy border border-white/20 text-cream focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPriceRange([0, 500])}
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-cream hover:bg-white/20 text-xs"
                        >
                          Under $500
                        </button>
                        <button
                          onClick={() => setPriceRange([500, 1500])}
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-cream hover:bg-white/20 text-xs"
                        >
                          $500 - $1500
                        </button>
                        <button
                          onClick={() => setPriceRange([1500, 10000])}
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-cream hover:bg-white/20 text-xs"
                        >
                          Over $1500
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <h4 className="text-cream font-medium text-sm mb-3 uppercase tracking-wider">
                      Availability
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 text-gold focus:ring-gold focus:ring-offset-0"
                      />
                      <span className="text-cream text-sm">In stock only</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Active Filter Tags */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs">
                      <span>Search: {searchQuery}</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:text-gold/70"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </div>
                  )}
                  {selectedCategory !== "all" && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="hover:text-gold/70"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </div>
                  )}
                  {selectedSubcategories.map((subcategory) => (
                    <div
                      key={subcategory}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs"
                    >
                      <span>{subcategory}</span>
                      <button
                        onClick={() =>
                          setSelectedSubcategories(
                            selectedSubcategories.filter(
                              (s) => s !== subcategory
                            )
                          )
                        }
                        className="hover:text-gold/70"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                  {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs">
                      <span>
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                      <button
                        onClick={() => setPriceRange([0, 10000])}
                        className="hover:text-gold/70"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </div>
                  )}
                  {inStockOnly && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs">
                      <span>In Stock</span>
                      <button
                        onClick={() => setInStockOnly(false)}
                        className="hover:text-gold/70"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Results Count */}
              {!loading && (
                <div className="text-cream/70 text-sm">
                  Showing {sortedProducts.length} of {products.length} products
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                </div>
              )}

              {/* No Products State */}
              {!loading && sortedProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <span className="material-symbols-outlined text-6xl text-gold/50">
                    inventory_2
                  </span>
                  <p className="text-cream text-xl font-medium">
                    No products found
                  </p>
                  <p className="text-cream/70 text-sm">
                    Try adjusting your filters
                  </p>
                </div>
              )}

              {/* Products Grid */}
              {!loading && sortedProducts.length > 0 && (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {sortedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group relative bg-cover bg-center flex flex-col rounded-lg justify-end aspect-[3/4] overflow-hidden cursor-pointer"
                      style={{
                        backgroundImage: `url("${product.images[0]}")`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="relative p-4 flex flex-col gap-1.5 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        <p className="text-cream text-base font-bold leading-tight">
                          {product.name}
                        </p>
                        <p className="text-gold text-sm font-medium">
                          {formatPrice(product.price)}
                        </p>
                        {product.stock < 10 && product.stock > 0 && (
                          <span className="text-xs text-orange-400">
                            Only {product.stock} left
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="text-xs text-red-400">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Product Count */}
              {!loading && sortedProducts.length > 0 && (
                <div className="text-center text-cream/70 text-sm py-4">
                  Showing {sortedProducts.length}{" "}
                  {sortedProducts.length === 1 ? "product" : "products"}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


