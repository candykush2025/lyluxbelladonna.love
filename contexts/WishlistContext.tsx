"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getWishlist, updateWishlist } from "@/lib/firestore";
import { getProduct } from "@/lib/firestore";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: Date;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount and when user changes
  useEffect(() => {
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      if (user) {
        // Load from Firestore for authenticated users
        const wishlistData = await getWishlist(user.uid);
        setWishlistItems(wishlistData.items || []);
      } else {
        // Load from localStorage for guests
        const localWishlist = localStorage.getItem("wishlist");
        if (localWishlist) {
          setWishlistItems(JSON.parse(localWishlist));
        } else {
          setWishlistItems([]);
        }
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveWishlist = async (items: WishlistItem[]) => {
    if (user) {
      // Save to Firestore for authenticated users
      try {
        await updateWishlist(user.uid, items);
      } catch (error) {
        // If document doesn't exist, create it
        try {
          const wishlistRef = doc(db, "wishlists", user.uid);
          await setDoc(wishlistRef, {
            items,
            updatedAt: new Date(),
          });
        } catch (createError) {
          console.error("Error creating wishlist:", createError);
        }
      }
    } else {
      // Save to localStorage for guests
      localStorage.setItem("wishlist", JSON.stringify(items));
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      // Check if already in wishlist
      if (isInWishlist(productId)) {
        return;
      }

      // Fetch product details
      const product = await getProduct(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      const newItem: WishlistItem = {
        productId,
        name: (product as any).name,
        price: (product as any).price,
        image: (product as any).images?.[0] || "",
        addedAt: new Date(),
      };

      const updatedItems = [...wishlistItems, newItem];
      setWishlistItems(updatedItems);
      await saveWishlist(updatedItems);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const updatedItems = wishlistItems.filter(
        (item) => item.productId !== productId
      );
      setWishlistItems(updatedItems);
      await saveWishlist(updatedItems);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const clearWishlist = async () => {
    try {
      setWishlistItems([]);
      await saveWishlist([]);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      throw error;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
