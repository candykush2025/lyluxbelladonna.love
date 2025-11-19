"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
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

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const handleRemove = (productId: string, size?: string, color?: string) => {
    if (confirm("Remove this item from cart?")) {
      removeFromCart(productId, size, color);
    }
  };

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number,
    size?: string,
    color?: string
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity, size, color);
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
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || ""}-${
                      item.color || ""
                    }`}
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
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && (
                          <span className="mx-2">|</span>
                        )}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="text-primary font-semibold mt-2">
                        ${item.price ? item.price.toFixed(2) : "0.00"}
                      </p>
                      {item.stock !== undefined &&
                        item.stock < 5 &&
                        item.stock > 0 && (
                          <p className="text-yellow-400 text-sm mt-1">
                            Only {item.stock} left in stock
                          </p>
                        )}
                      {item.stock === 0 && (
                        <p className="text-red-400 text-sm mt-1">
                          Out of stock
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity,
                                -1,
                                item.size,
                                item.color
                              )
                            }
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"
                          >
                            -
                          </button>
                          <span className="text-white w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity,
                                1,
                                item.size,
                                item.color
                              )
                            }
                            disabled={
                              item.stock !== undefined &&
                              item.quantity >= item.stock
                            }
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleRemove(item.productId, item.size, item.color)
                          }
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white/5 rounded-lg p-6 sticky top-24">
                  <h2 className="text-white text-2xl font-bold mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
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
