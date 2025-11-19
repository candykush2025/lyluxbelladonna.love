"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCart, updateCart } from "@/lib/firestore";
import { getProduct } from "@/lib/firestore";

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  addedAt: Date;
  // Populated fields
  name?: string;
  price?: number;
  image?: string;
  stock?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => Promise<void>;
  removeFromCart: (
    productId: string,
    size?: string,
    color?: string
  ) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "guest_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);

      if (user) {
        // Load from Firestore for authenticated users
        const firestoreCart = await getCart(user.uid);
        if (firestoreCart && firestoreCart.items) {
          // Populate product details
          const populatedItems = await Promise.all(
            firestoreCart.items.map(async (item: any) => {
              try {
                const product = await getProduct(item.productId);
                const productData = product as any; // Cast to any to access properties
                return {
                  ...item,
                  addedAt: item.addedAt?.toDate() || new Date(),
                  name: productData?.name,
                  price: productData?.price,
                  image: productData?.images?.[0],
                  stock: productData?.stock,
                };
              } catch (error) {
                console.error(
                  `Error loading product ${item.productId}:`,
                  error
                );
                return {
                  ...item,
                  addedAt: item.addedAt?.toDate() || new Date(),
                };
              }
            })
          );
          setCartItems(populatedItems);
        } else {
          setCartItems([]);
        }

        // Merge guest cart if exists
        const guestCart = getGuestCart();
        if (guestCart.length > 0) {
          await mergeGuestCart(guestCart);
          clearGuestCart();
        }
      } else {
        // Load from localStorage for guests
        const guestCart = getGuestCart();
        const populatedItems = await Promise.all(
          guestCart.map(async (item) => {
            try {
              const product = await getProduct(item.productId);
              const productData = product as any;
              return {
                ...item,
                name: productData?.name,
                price: productData?.price,
                image: productData?.images?.[0],
                stock: productData?.stock,
              };
            } catch (error) {
              console.error(`Error loading product ${item.productId}:`, error);
              return item;
            }
          })
        );
        setCartItems(populatedItems);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGuestCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }));
    } catch {
      return [];
    }
  };

  const saveGuestCart = (items: CartItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  };

  const clearGuestCart = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(GUEST_CART_KEY);
  };

  const mergeGuestCart = async (guestCart: CartItem[]) => {
    if (!user) return;

    try {
      // Get current Firestore cart
      const firestoreCart = await getCart(user.uid);
      const existingItems = firestoreCart?.items || [];

      // Merge items
      const mergedItems = [...existingItems];

      for (const guestItem of guestCart) {
        const existingIndex = mergedItems.findIndex(
          (item: any) =>
            item.productId === guestItem.productId &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );

        if (existingIndex >= 0) {
          // Update quantity
          mergedItems[existingIndex].quantity += guestItem.quantity;
        } else {
          // Add new item
          mergedItems.push({
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            size: guestItem.size,
            color: guestItem.color,
            addedAt: new Date(),
          });
        }
      }

      // Save merged cart to Firestore
      await updateCart(user.uid, mergedItems);
      await loadCart();
    } catch (error) {
      console.error("Error merging guest cart:", error);
    }
  };

  const addToCart = async (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    try {
      const newItem: CartItem = {
        productId,
        quantity,
        size,
        color,
        addedAt: new Date(),
      };

      // Load product details
      const product = await getProduct(productId);
      if (product) {
        const productData = product as any;
        newItem.name = productData.name;
        newItem.price = productData.price;
        newItem.image = productData.images?.[0];
        newItem.stock = productData.stock;
      }

      if (user) {
        // Save to Firestore
        const currentCart = await getCart(user.uid);
        const existingItems = currentCart?.items || [];

        const existingIndex = existingItems.findIndex(
          (item: any) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
        );

        if (existingIndex >= 0) {
          existingItems[existingIndex].quantity += quantity;
        } else {
          const cartItem: any = {
            productId,
            quantity,
            addedAt: new Date(),
          };
          if (size !== undefined) cartItem.size = size;
          if (color !== undefined) cartItem.color = color;
          existingItems.push(cartItem);
        }

        await updateCart(user.uid, existingItems);
        await loadCart();
      } else {
        // Save to localStorage
        const existingIndex = cartItems.findIndex(
          (item) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
        );

        let updatedItems;
        if (existingIndex >= 0) {
          updatedItems = [...cartItems];
          updatedItems[existingIndex].quantity += quantity;
        } else {
          updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (
    productId: string,
    size?: string,
    color?: string
  ) => {
    try {
      if (user) {
        const currentCart = await getCart(user.uid);
        const existingItems = currentCart?.items || [];

        const filteredItems = existingItems.filter(
          (item: any) =>
            !(
              item.productId === productId &&
              item.size === size &&
              item.color === color
            )
        );

        await updateCart(user.uid, filteredItems);
        await loadCart();
      } else {
        const filteredItems = cartItems.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.size === size &&
              item.color === color
            )
        );
        setCartItems(filteredItems);
        saveGuestCart(filteredItems);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color);
      return;
    }

    try {
      if (user) {
        const currentCart = await getCart(user.uid);
        const existingItems = currentCart?.items || [];

        const itemIndex = existingItems.findIndex(
          (item: any) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
        );

        if (itemIndex >= 0) {
          existingItems[itemIndex].quantity = quantity;
          await updateCart(user.uid, existingItems);
          await loadCart();
        }
      } else {
        const itemIndex = cartItems.findIndex(
          (item) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
        );

        if (itemIndex >= 0) {
          const updatedItems = [...cartItems];
          updatedItems[itemIndex].quantity = quantity;
          setCartItems(updatedItems);
          saveGuestCart(updatedItems);
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await updateCart(user.uid, []);
        await loadCart();
      } else {
        setCartItems([]);
        clearGuestCart();
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
