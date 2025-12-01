"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/lib/currency-context";
import Image from "next/image";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
  } = useCart();
  const { formatPrice } = useCurrency();

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const handleRemove = (item: any) => {
    if (confirm("Remove this item from cart?")) {
      removeFromCart(item.productId, item.size, item.color, item.variants);
    }
  };

  const handleQuantityChange = (
    item: any,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(
        item.productId,
        newQuantity,
        item.size,
        item.color,
        item.variants
      );
    }
  };

  const handleClearCart = () => {
    if (confirm("Clear all items from cart?")) {
      clearCart();
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-white text-5xl font-black font-serif">
              Shopping Cart
            </h1>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl mb-6">Your cart is empty</p>
              <Link
                href="/products"
                className="inline-block bg-primary text-background-dark font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-opacity"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item, index) => {
                  // Debug logging
                  console.log("Cart item data:", {
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    variants: item.variants,
                    variantName: item.variantName,
                    variantOption: item.variantOption,
                    variantPrice: item.variantPrice,
                    variantImage: item.variantImage,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                  });

                  // Generate unique key including variants
                  const variantKey =
                    item.variants && Array.isArray(item.variants)
                      ? item.variants
                          .map((v) => `${v.name}-${v.option}`)
                          .join("-")
                      : "";
                  const itemKey = `${item.productId}-${item.size || ""}-${
                    item.color || ""
                  }-${variantKey || index}`;

                  return (
                    <div
                      key={itemKey}
                      className="bg-white/5 rounded-lg p-6 flex gap-6"
                    >
                      <Link
                        href={`/products/${item.productId}`}
                        className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden hover:opacity-80 transition-opacity shrink-0"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name || "Product"}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            No Image
                          </div>
                        )}
                      </Link>
                      <div className="flex-1">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="text-white font-bold text-lg hover:text-primary transition-colors">
                            {item.name || "Product"}
                          </h3>
                        </Link>
                        <div className="text-gray-400 text-sm mt-1">
                          {item.variants &&
                          Array.isArray(item.variants) &&
                          item.variants.length > 0 ? (
                            // Display variants array information
                            item.variants.map((variant, index) => (
                              <span key={index}>
                                {variant.name}: {variant.option}
                                {index < item.variants!.length - 1 && " | "}
                              </span>
                            ))
                          ) : (
                            // Fallback to legacy display
                            <>
                              {item.variantName && item.variantOption && (
                                <span>
                                  {item.variantName}: {item.variantOption}
                                </span>
                              )}
                              {item.size && (
                                <span>
                                  {item.variantName &&
                                    item.variantOption &&
                                    " | "}
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span>
                                  {((item.variantName && item.variantOption) ||
                                    item.size) &&
                                    " | "}
                                  Color: {item.color}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-primary font-semibold mt-2">
                          {formatPrice(item.price || 0)}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity, -1)
                              }
                              className="w-8 h-8 rounded-full bg-[#1a2332]/10 flex items-center justify-center hover:bg-white/20 text-white"
                            >
                              -
                            </button>
                            <span className="text-white w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity, 1)
                              }
                              className="w-8 h-8 rounded-full bg-[#1a2332]/10 flex items-center justify-center hover:bg-white/20 text-white"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white/5 rounded-lg p-6 sticky top-24">
                  <h2 className="text-white text-2xl font-bold mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax (10%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full bg-primary text-background-dark font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-opacity mb-4 text-center"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/products"
                    className="block text-center text-primary hover:text-primary/80 text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


