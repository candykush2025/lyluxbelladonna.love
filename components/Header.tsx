"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CurrencySelector from "@/components/CurrencySelector";

export default function Header() {
  const { user, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background-dark/80 backdrop-blur-sm border-b border-solid border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
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
            <CurrencySelector />
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
        <button
          ref={hamburgerButtonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center rounded-full h-10 w-10 bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-gray-900 border-b border-white/20 shadow-xl animate-in slide-in-from-top-2 duration-300 z-50"
        >
          <div className="px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Navigation Links */}
            <nav className="space-y-1">
              <Link
                className="block text-white text-lg font-medium leading-normal hover:text-primary hover:bg-white/5 transition-all duration-200 py-3 px-3 rounded-lg active:bg-white/10"
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New In
              </Link>
              <Link
                className="block text-white text-lg font-medium leading-normal hover:text-primary hover:bg-white/5 transition-all duration-200 py-3 px-3 rounded-lg active:bg-white/10"
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                className="block text-white text-lg font-medium leading-normal hover:text-primary hover:bg-white/5 transition-all duration-200 py-3 px-3 rounded-lg active:bg-white/10"
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Clothing
              </Link>
              <Link
                className="block text-white text-lg font-medium leading-normal hover:text-primary hover:bg-white/5 transition-all duration-200 py-3 px-3 rounded-lg active:bg-white/10"
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link
                className="block text-white text-lg font-medium leading-normal hover:text-primary hover:bg-white/5 transition-all duration-200 py-3 px-3 rounded-lg active:bg-white/10"
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                className="block text-white text-lg font-medium leading-normal hover:text-primary hover:bg-white/5 transition-all duration-200 py-3 px-3 rounded-lg active:bg-white/10"
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {/* Currency Selector */}
            <div className="py-2">
              <CurrencySelector />
            </div>

            {/* User Actions */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
              <button className="flex items-center justify-start gap-3 rounded-lg h-12 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-200 px-4 text-lg font-medium">
                <span className="material-symbols-outlined text-xl">
                  search
                </span>
                Search
              </button>

              {user ? (
                <>
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-start gap-3 rounded-lg h-12 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-200 px-4 text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      favorite
                    </span>
                    Wishlist
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center justify-start gap-3 rounded-lg h-12 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-200 px-4 text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      person
                    </span>
                    My Profile
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center justify-start gap-3 rounded-lg h-12 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-200 px-4 text-lg font-medium relative"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      shopping_bag
                    </span>
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute top-2 right-2 bg-primary text-background-dark text-sm font-bold rounded-full min-w-6 h-6 flex items-center justify-center px-1.5">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-start gap-3 rounded-lg h-12 bg-primary/20 text-primary hover:bg-primary/30 active:bg-primary/40 transition-all duration-200 px-4 text-lg font-medium border border-primary/30"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        admin_panel_settings
                      </span>
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-start gap-3 rounded-lg h-12 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-200 px-4 text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      login
                    </span>
                    Login
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center justify-start gap-3 rounded-lg h-12 bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-200 px-4 text-lg font-medium relative"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      shopping_bag
                    </span>
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute top-2 right-2 bg-primary text-background-dark text-sm font-bold rounded-full min-w-6 h-6 flex items-center justify-center px-1.5">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
