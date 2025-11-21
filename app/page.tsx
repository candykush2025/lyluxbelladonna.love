"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getProducts } from "@/lib/firestore";
import { getHomepageContent } from "@/lib/firestore";
import { orderBy, limit } from "firebase/firestore";
import { useCurrency } from "@/lib/currency-context";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured: boolean;
  status: string;
  sku: string;
  tags: string[];
  rating: number;
  hasVariants?: boolean;
  variants?: Array<{
    name: string;
    options: Array<{
      name: string;
      price: number;
      image?: string;
    }>;
  }>;
  reviewCount: number;
}

interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    shopNowText: string;
  };
  collections: Array<{
    id: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
    link: string;
  }>;
  craft: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [homepageContent, setHomepageContent] =
    useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadNewArrivals();
    loadHomepageContent();
  }, []);

  const loadNewArrivals = async () => {
    try {
      setLoading(true);
      // Get newest products sorted by creation date (descending)
      const products = await getProducts([
        orderBy("createdAt", "desc"),
        limit(4),
      ]);
      setNewArrivals(products as Product[]);
    } catch (error) {
      console.error("Error loading new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadHomepageContent = async () => {
    try {
      setContentLoading(true);
      const content = await getHomepageContent();
      if (content) {
        // Remove the id field and cast to HomepageContent
        const { id, ...contentData } = content;
        setHomepageContent(contentData as HomepageContent);
      }
    } catch (error) {
      console.error("Error loading homepage content:", error);
    } finally {
      setContentLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-5">
          <div className="flex flex-col w-full max-w-[1280px] mx-auto">
            <div className="flex flex-col gap-16 md:gap-24 mt-8">
              {/* Hero Section */}
              <div className="@container">
                <div className="p-4 sm:p-4">
                  <div
                    className="flex min-h-[60vh] md:min-h-[75vh] flex-col gap-8 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-4 text-center"
                    style={{
                      backgroundImage: homepageContent?.hero?.backgroundImage
                        ? `linear-gradient(rgba(12, 24, 33, 0.2) 0%, rgba(12, 24, 33, 0.6) 100%), url("${homepageContent.hero.backgroundImage}")`
                        : 'linear-gradient(rgba(12, 24, 33, 0.2) 0%, rgba(12, 24, 33, 0.6) 100%), url("https://via.placeholder.com/1920x1080?text=Hero+Image")',
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      <h1 className="text-white text-5xl font-black leading-tight tracking-tight font-serif sm:text-7xl">
                        {homepageContent?.hero?.title ||
                          "Welcome to Lylux Belladonna"}
                      </h1>
                      <h2 className="text-white/90 text-base font-normal leading-normal sm:text-lg">
                        {homepageContent?.hero?.subtitle ||
                          "Discover timeless elegance and modern sophistication."}
                      </h2>
                    </div>
                    <Link
                      href="/products"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 sm:h-14 sm:px-10 bg-transparent border border-primary text-primary hover:bg-primary hover:text-background-dark transition-colors text-sm font-bold leading-normal tracking-[0.015em] sm:text-base"
                    >
                      <span className="truncate">
                        {homepageContent?.hero?.shopNowText || "Shop Now"}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* New Arrivals */}
              <section className="flex flex-col gap-4">
                <h2 className="text-white text-3xl font-serif font-bold leading-tight tracking-tight px-4">
                  New Arrivals
                </h2>
                <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex items-stretch p-4 gap-6">
                    {loading
                      ? // Loading skeleton
                        Array.from({ length: 4 }).map((_, index) => (
                          <div
                            key={index}
                            className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-64 animate-pulse"
                          >
                            <div className="w-full aspect-[3/4] bg-gray-700 rounded-lg"></div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-700 rounded"></div>
                              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                            </div>
                          </div>
                        ))
                      : newArrivals.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-64 group cursor-pointer"
                          >
                            <div
                              className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col transition-transform group-hover:scale-105"
                              style={{
                                backgroundImage:
                                  product.images && product.images.length > 0
                                    ? `url("${product.images[0]}")`
                                    : 'url("https://via.placeholder.com/300x400?text=No+Image")',
                              }}
                            ></div>
                            <div>
                              <p className="text-white text-base font-medium leading-normal group-hover:text-primary transition-colors">
                                {product.name}
                              </p>
                              <p className="text-primary text-sm font-normal leading-normal">
                                {product.hasVariants && product.variants
                                  ? (() => {
                                      const allPrices = product.variants
                                        .flatMap(
                                          (v: any) =>
                                            v.options?.map(
                                              (o: any) => o.price
                                            ) || []
                                        )
                                        .filter((p: number) => p > 0);
                                      const minPrice = Math.min(...allPrices);
                                      const maxPrice = Math.max(...allPrices);
                                      if (minPrice === maxPrice) {
                                        return formatPrice(minPrice);
                                      }
                                      return `${formatPrice(
                                        minPrice
                                      )} - ${formatPrice(maxPrice)}`;
                                    })()
                                  : formatPrice(product.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                  </div>
                </div>
              </section>

              {/* Featured Collections */}
              <section className="flex flex-col gap-6">
                <h2 className="text-white text-3xl font-serif font-bold leading-tight tracking-tight px-4">
                  Featured Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  {homepageContent?.collections?.map((collection) => (
                    <Link
                      key={collection.id}
                      className="group relative flex items-end justify-start min-h-96 rounded-xl overflow-hidden"
                      href={collection.link || "/products"}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                        style={{
                          backgroundImage: collection.backgroundImage
                            ? `url("${collection.backgroundImage}")`
                            : 'url("https://via.placeholder.com/600x400?text=Collection+Image")',
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                      <div className="relative p-8">
                        <h3 className="text-white text-4xl font-serif font-bold">
                          {collection.title}
                        </h3>
                        <p className="text-primary mt-1">
                          {collection.subtitle}
                        </p>
                      </div>
                    </Link>
                  )) || (
                    <>
                      <Link
                        className="group relative flex items-end justify-start min-h-96 rounded-xl overflow-hidden"
                        href="/products"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_ducnJ8AmXCNRgW7Rc74jnAwSjG0xWJlnEWnlOr_hVZt7lhrsh7jghy3K5cKBb3NGlmfyuwtofkmEBwZRklNiJeY7_5_oEke3SI8820_c_HvQEQZO9266_s3uDoNqzuvsb_aCcC6pZmb2f9_ABcfhfVJGtfo9U2nQS8SwSEWjV2c7IzA-yp0oBo9fpl_P8qT9L-AU8FBCTXa2kU78sZ-b9SFrRrziragFUszlYHFaxiYNAAoP0pLzdp6Fok1xyIM0WvsfQHvTN0")',
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                        <div className="relative p-8">
                          <h3 className="text-white text-4xl font-serif font-bold">
                            The Evening Edit
                          </h3>
                          <p className="text-primary mt-1">Shop Collection</p>
                        </div>
                      </Link>
                      <Link
                        className="group relative flex items-end justify-start min-h-96 rounded-xl overflow-hidden"
                        href="/products"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpY63pOULIh0ykCEQ3__5GYxAqX4f6xWY4KV5ORKPkoZW7SJzkR_GJ5VimZvBY7YfbCSLohFxDpJjc1wwIxNHo7CO1FS7kPGZhieKzHpoxDHXZzoc9SalATd4x5dUSOIM_Gx4BCJ5JNPQrhvE72BKVjY4cxUlNhY4E5d-VtNLXUZC9PTiTnuF3xaXSaxkEdTPsO1iiz36KbWe1yOgR97_GA3BJGc5LB_a105xVU8UItQ4RatFtnW7tDXuFyR1xHLHXWEmu9ZKhvEM")',
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                        <div className="relative p-8">
                          <h3 className="text-white text-4xl font-serif font-bold">
                            Artisan Leather
                          </h3>
                          <p className="text-primary mt-1">Shop Collection</p>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </section>

              {/* Craft Section */}
              <section className="bg-white/5 rounded-xl px-8 py-12 md:py-20 flex flex-col items-center text-center gap-6">
                <h3 className="text-white text-3xl font-serif font-bold">
                  {homepageContent?.craft?.title || "The Art of Craft"}
                </h3>
                <p className="max-w-3xl text-gray-300">
                  {homepageContent?.craft?.description ||
                    "At Lylux Belladonna, we believe in the enduring power of craftsmanship. Each piece is meticulously designed and created with the finest materials, blending traditional techniques with a modern sensibility to create not just clothing, but timeless art."}
                </p>
                <Link
                  href={homepageContent?.craft?.buttonLink || "/about"}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-primary text-background-dark hover:bg-opacity-90 transition-opacity text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">
                    {homepageContent?.craft?.buttonText ||
                      "Discover Our Philosophy"}
                  </span>
                </Link>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
