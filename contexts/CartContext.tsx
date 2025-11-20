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
  // Variant information (array for multiple variants)
  variants?: Array<{
    name: string;
    option: string;
    price?: number;
    image?: string;
  }>;
  // Legacy single variant fields (for backward compatibility)
  variantName?: string;
  variantOption?: string;
  variantPrice?: number;
  variantImage?: string;
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
    color?: string,
    variants?: Array<{
      name: string;
      option: string;
      price?: number;
      image?: string;
    }>,
    variantName?: string,
    variantOption?: string,
    variantPrice?: number,
    variantImage?: string
  ) => Promise<void>;
  removeFromCart: (
    productId: string,
    size?: string,
    color?: string,
    variants?: Array<{
      name: string;
      option: string;
      price?: number;
      image?: string;
    }>
  ) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string,
    variants?: Array<{
      name: string;
      option: string;
      price?: number;
      image?: string;
    }>
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

                // Get the correct price and image for variant products
                let itemPrice = productData?.price;
                let itemImage = productData?.images?.[0];

                // Use variants array if available (preferred method)
                if (item.variants && item.variants.length > 0) {
                  const firstVariant = item.variants[0];
                  if (firstVariant.price !== undefined) {
                    itemPrice = firstVariant.price;
                  }
                  if (firstVariant.image) {
                    itemImage = firstVariant.image;
                  }
                } else if (item.variantPrice !== undefined) {
                  // Fallback to legacy single variant fields
                  itemPrice = item.variantPrice;
                } else if (productData?.hasVariants && productData?.variants) {
                  // Fallback to variant lookup logic
                  for (const variant of productData.variants) {
                    if (variant.name.toLowerCase() === "size" && item.size) {
                      const option = variant.options.find(
                        (opt: any) => opt.name === item.size
                      );
                      if (option) {
                        itemPrice = option.price || itemPrice;
                        itemImage = option.image || itemImage;
                      }
                    } else if (
                      variant.name.toLowerCase() === "color" &&
                      item.color
                    ) {
                      const option = variant.options.find(
                        (opt: any) => opt.name === item.color
                      );
                      if (option) {
                        itemPrice = option.price || itemPrice;
                        itemImage = option.image || itemImage;
                      }
                    }
                  }
                }

                // Use stored variant image if available (legacy fallback)
                if (item.variantImage) {
                  itemImage = item.variantImage;
                }

                return {
                  ...item,
                  addedAt: item.addedAt?.toDate() || new Date(),
                  name: productData?.name,
                  price: itemPrice,
                  image: itemImage,
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

              // Get the correct price and image for variant products
              let itemPrice = productData?.price;
              let itemImage = productData?.images?.[0];

              // Use variants array if available (preferred method)
              if (item.variants && item.variants.length > 0) {
                const firstVariant = item.variants[0];
                if (firstVariant.price !== undefined) {
                  itemPrice = firstVariant.price;
                }
                if (firstVariant.image) {
                  itemImage = firstVariant.image;
                }
              } else if (item.variantPrice !== undefined) {
                // Fallback to legacy single variant fields
                itemPrice = item.variantPrice;
              } else if (productData?.hasVariants && productData?.variants) {
                // Fallback to variant lookup logic
                for (const variant of productData.variants) {
                  if (variant.name.toLowerCase() === "size" && item.size) {
                    const option = variant.options.find(
                      (opt: any) => opt.name === item.size
                    );
                    if (option) {
                      itemPrice = option.price || itemPrice;
                      itemImage = option.image || itemImage;
                    }
                  } else if (
                    variant.name.toLowerCase() === "color" &&
                    item.color
                  ) {
                    const option = variant.options.find(
                      (opt: any) => opt.name === item.color
                    );
                    if (option) {
                      itemPrice = option.price || itemPrice;
                      itemImage = option.image || itemImage;
                    }
                  }
                }
              }

              // Use stored variant image if available (legacy fallback)
              if (item.variantImage) {
                itemImage = item.variantImage;
              }

              return {
                ...item,
                name: productData?.name,
                price: itemPrice,
                image: itemImage,
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
    color?: string,
    variants?: Array<{
      name: string;
      option: string;
      price?: number;
      image?: string;
    }>,
    variantName?: string,
    variantOption?: string,
    variantPrice?: number,
    variantImage?: string
  ) => {
    try {
      console.log("🛒 CartContext.addToCart called with:", {
        productId,
        quantity,
        size,
        color,
        variants,
        variantName,
        variantOption,
        variantPrice,
        variantImage,
      });

      const newItem: CartItem = {
        productId,
        quantity,
        size,
        color,
        variants,
        variantName,
        variantOption,
        variantPrice,
        variantImage,
        addedAt: new Date(),
      }; // Load product details
      const product = await getProduct(productId);
      if (product) {
        const productData = product as any;

        // Check if product is in stock (only if stock management is enabled)
        if (productData.manageStock && productData.stock <= 0) {
          throw new Error("This product is currently out of stock.");
        }

        // Get the correct price and image for variant products
        let itemPrice = productData.price;
        let itemImage = productData.images?.[0];

        // Use variants array if provided (preferred method)
        if (variants && variants.length > 0) {
          // Use the first variant's price and image as the main item price/image
          const firstVariant = variants[0];
          if (firstVariant.price !== undefined) {
            itemPrice = firstVariant.price;
          }
          if (firstVariant.image) {
            itemImage = firstVariant.image;
          }
        } else if (variantPrice !== undefined) {
          // Fallback to legacy single variant fields
          itemPrice = variantPrice;
        } else if (productData.hasVariants && productData.variants) {
          // Fallback to variant lookup logic
          for (const variant of productData.variants) {
            if (variant.name.toLowerCase() === "size" && size) {
              const option = variant.options.find(
                (opt: any) => opt.name === size
              );
              if (option) {
                itemPrice = option.price || itemPrice;
                itemImage = option.image || itemImage;
              }
            } else if (variant.name.toLowerCase() === "color" && color) {
              const option = variant.options.find(
                (opt: any) => opt.name === color
              );
              if (option) {
                itemPrice = option.price || itemPrice;
                itemImage = option.image || itemImage;
              }
            }
          }
        }

        // Use variant image if provided (legacy fallback)
        if (variantImage) {
          itemImage = variantImage;
        }

        newItem.name = productData.name;
        newItem.price = itemPrice;
        newItem.image = itemImage;
        newItem.stock = productData.stock;
      } else {
        throw new Error("Product not found.");
      }

      if (user) {
        // Save to Firestore
        const currentCart = await getCart(user.uid);
        const existingItems = currentCart?.items || [];

        // Helper function to compare variants
        const variantsMatch = (itemVariants: any, newVariants: any) => {
          if (!itemVariants && !newVariants) return true;
          if (!itemVariants || !newVariants) return false;
          if (!Array.isArray(itemVariants) || !Array.isArray(newVariants))
            return false;
          if (itemVariants.length !== newVariants.length) return false;

          // Compare each variant option
          return itemVariants.every((itemVar: any, index: number) => {
            const newVar = newVariants[index];
            return (
              itemVar.name === newVar.name && itemVar.option === newVar.option
            );
          });
        };

        const existingIndex = existingItems.findIndex(
          (item: any) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color &&
            variantsMatch(item.variants, variants)
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
          if (variants !== undefined) cartItem.variants = variants;
          if (variantName !== undefined) cartItem.variantName = variantName;
          if (variantOption !== undefined)
            cartItem.variantOption = variantOption;
          if (variantPrice !== undefined) cartItem.variantPrice = variantPrice;
          if (variantImage !== undefined) cartItem.variantImage = variantImage;
          existingItems.push(cartItem);
        }

        await updateCart(user.uid, existingItems);
        await loadCart();
      } else {
        // Save to localStorage
        // Helper function to compare variants
        const variantsMatch = (itemVariants: any, newVariants: any) => {
          if (!itemVariants && !newVariants) return true;
          if (!itemVariants || !newVariants) return false;
          if (!Array.isArray(itemVariants) || !Array.isArray(newVariants))
            return false;
          if (itemVariants.length !== newVariants.length) return false;

          // Compare each variant option
          return itemVariants.every((itemVar: any, index: number) => {
            const newVar = newVariants[index];
            return (
              itemVar.name === newVar.name && itemVar.option === newVar.option
            );
          });
        };

        const existingIndex = cartItems.findIndex(
          (item) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color &&
            variantsMatch(item.variants, variants)
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
    color?: string,
    variants?: Array<{
      name: string;
      option: string;
      price?: number;
      image?: string;
    }>
  ) => {
    try {
      // Helper function to compare variants
      const variantsMatch = (itemVariants: any, newVariants: any) => {
        if (!itemVariants && !newVariants) return true;
        if (!itemVariants || !newVariants) return false;
        if (!Array.isArray(itemVariants) || !Array.isArray(newVariants))
          return false;
        if (itemVariants.length !== newVariants.length) return false;

        return itemVariants.every((itemVar: any, index: number) => {
          const newVar = newVariants[index];
          return (
            itemVar.name === newVar.name && itemVar.option === newVar.option
          );
        });
      };

      if (user) {
        const currentCart = await getCart(user.uid);
        const existingItems = currentCart?.items || [];

        const filteredItems = existingItems.filter(
          (item: any) =>
            !(
              item.productId === productId &&
              item.size === size &&
              item.color === color &&
              variantsMatch(item.variants, variants)
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
              item.color === color &&
              variantsMatch(item.variants, variants)
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
    color?: string,
    variants?: Array<{
      name: string;
      option: string;
      price?: number;
      image?: string;
    }>
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color, variants);
      return;
    }

    try {
      // Helper function to compare variants
      const variantsMatch = (itemVariants: any, newVariants: any) => {
        if (!itemVariants && !newVariants) return true;
        if (!itemVariants || !newVariants) return false;
        if (!Array.isArray(itemVariants) || !Array.isArray(newVariants))
          return false;
        if (itemVariants.length !== newVariants.length) return false;

        return itemVariants.every((itemVar: any, index: number) => {
          const newVar = newVariants[index];
          return (
            itemVar.name === newVar.name && itemVar.option === newVar.option
          );
        });
      };

      if (user) {
        const currentCart = await getCart(user.uid);
        const existingItems = currentCart?.items || [];

        const itemIndex = existingItems.findIndex(
          (item: any) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color &&
            variantsMatch(item.variants, variants)
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
            item.color === color &&
            variantsMatch(item.variants, variants)
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
