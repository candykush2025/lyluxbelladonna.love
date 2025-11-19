"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { user, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 w-full bg-background-dark/80 backdrop-blur-sm border-b border-solid border-white/10">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
        <Link className="flex items-center gap-3 text-white" href="/">
          <svg
            className="h-8 w-auto text-primary"
            fill="none"
            viewBox="0 0 34 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.9998 0.504883L33.4947 16L16.9998 31.4951L0.504883 16L16.9998 0.504883Z"
              stroke="currentColor"
              strokeWidth="1.5"
            ></path>
            <path
              d="M17 31.4951V0.504883L8.75244 16L17 31.4951Z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="text-white text-2xl font-serif font-bold tracking-wide">
            Belladonna
          </span>
        </Link>
        <div className="hidden lg:flex flex-1 justify-end gap-8">
          <nav className="flex items-center gap-9">
            <Link
              className="text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              New In
            </Link>
            <Link
              className="text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              Collections
            </Link>
            <Link
              className="text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              Clothing
            </Link>
            <Link
              className="text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/products"
            >
              Accessories
            </Link>
            <Link
              className="text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="/contact"
            >
              Contact
            </Link>
          </nav>
          <div className="flex gap-2">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-white/10 text-white hover:bg-white/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            {user ? (
              <>
                <Link
                  href="/wishlist"
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-white/10 text-white hover:bg-white/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                  title="Wishlist"
                >
                  <span className="material-symbols-outlined text-xl">
                    favorite
                  </span>
                </Link>
                <Link
                  href="/account"
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-white/10 text-white hover:bg-white/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                  title="My Profile"
                >
                  <span className="material-symbols-outlined text-xl">
                    person
                  </span>
                </Link>
                <Link
                  href="/cart"
                  className="relative flex max-w-[480px] cursor-pointer items-center justify-center rounded-full h-10 bg-white/10 text-white hover:bg-white/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                >
                  <span className="material-symbols-outlined text-xl">
                    shopping_bag
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-background-dark text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-primary/20 text-primary hover:bg-primary/30 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                    title="Admin Dashboard"
                  >
                    <span className="material-symbols-outlined text-xl">
                      admin_panel_settings
                    </span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-white/10 text-white hover:bg-white/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                  title="Login"
                >
                  <span className="material-symbols-outlined text-xl">
                    login
                  </span>
                </Link>
                <Link
                  href="/cart"
                  className="relative flex max-w-[480px] cursor-pointer items-center justify-center rounded-full h-10 bg-white/10 text-white hover:bg-white/20 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                >
                  <span className="material-symbols-outlined text-xl">
                    shopping_bag
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-background-dark text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>
        <button className="lg:hidden flex items-center justify-center rounded-full h-10 w-10 bg-white/10 text-white hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>
    </header>
  );
}
