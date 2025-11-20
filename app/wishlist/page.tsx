"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useCurrency } from "@/lib/currency-context";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemoving(productId);
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      addToast("Failed to remove item from wishlist", "error");
    } finally {
      setRemoving(null);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
      addToast("Item moved to cart!", "success");
    } catch (error) {
      console.error("Error moving to cart:", error);
      addToast("Failed to move item to cart", "error");
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
          <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-white text-4xl md:text-5xl font-black font-serif">
              My Wishlist
            </h1>
            {wishlistItems.length > 0 && (
              <p className="text-gray-400">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"}
              </p>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-8xl text-gray-600 mb-6">
                favorite_border
              </span>
              <h2 className="text-white text-2xl font-semibold mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-400 mb-8">
                Start adding items you love to your wishlist
              </p>
              <Link
                href="/products"
                className="inline-block bg-primary text-background-dark font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.productId} className="group relative">
                  <Link
                    href={`/products/${item.productId}`}
                    className="block relative aspect-3/4 bg-gray-800 rounded-lg mb-4 overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-gray-600">
                          image
                        </span>
                      </div>
                    )}
                  </Link>

                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={removing === item.productId}
                    className="absolute top-2 right-2 w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {removing === item.productId ? (
                      <span className="material-symbols-outlined text-xl animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-xl">
                        favorite
                      </span>
                    )}
                  </button>

                  <Link href={`/products/${item.productId}`}>
                    <h3 className="text-white font-semibold hover:text-primary transition-colors line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-primary text-lg font-semibold mb-3">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleMoveToCart(item.productId)}
                      className="w-full bg-primary text-background-dark font-bold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-colors"
                    >
                      Move to Cart
                    </button>
                    <Link
                      href={`/products/${item.productId}`}
                      className="w-full bg-white/10 text-white font-medium py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {wishlistItems.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-block text-primary hover:text-white transition-colors font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
