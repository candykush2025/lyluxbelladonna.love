"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { getProduct, getReviews, createReview } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/contexts/ToastContext";

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
  reviewCount: number;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: any;
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { user } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [resolvedParams.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const fetchedProduct = await getProduct(resolvedParams.id);
      if (fetchedProduct) {
        const productData = fetchedProduct as Product;
        setProduct(productData);
        // Set default selections
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCartContext(
        product.id,
        quantity,
        selectedSize || undefined,
        selectedColor || undefined
      );

      // Show success message
      addToast(`Added ${quantity} ${product.name} to cart!`, "success");

      // Reset quantity
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      addToast("Failed to add to cart. Please try again.", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    try {
      setAddingToWishlist(true);
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setAddingToWishlist(false);
    }
  };

  const loadReviews = async () => {
    try {
      const fetchedReviews = await getReviews(resolvedParams.id);
      setReviews(fetchedReviews as Review[]);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert("Please login to submit a review");
      router.push("/login");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setSubmittingReview(true);
      await createReview({
        productId: resolvedParams.id,
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        rating: reviewRating,
        comment: reviewComment,
      });

      alert("Review submitted! It will appear after admin approval.");
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);
      loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-gold/50">
          inventory_2
        </span>
        <h2 className="text-2xl font-bold text-cream">Product not found</h2>
        <Link href="/products" className="text-gold hover:underline">
          Return to products
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-[#F8F8F8] dark:bg-[#0A192F]">
      <Header />
      <main className="px-4 sm:px-10 lg:px-20 py-10 flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              className="text-gold/80 text-sm font-medium leading-normal hover:text-gold"
              href="/"
            >
              Home
            </Link>
            <span className="text-gold/50 text-sm font-medium leading-normal">
              /
            </span>
            <Link
              className="text-gold/80 text-sm font-medium leading-normal hover:text-gold"
              href="/products"
            >
              Products
            </Link>
            <span className="text-gold/50 text-sm font-medium leading-normal">
              /
            </span>
            <span className="text-cream text-sm font-medium leading-normal">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div
                className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl cursor-pointer"
                style={{
                  backgroundImage: `url("${product.images[selectedImage]}")`,
                }}
                onClick={() =>
                  setSelectedImage((selectedImage + 1) % product.images.length)
                }
              ></div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg cursor-pointer transition-all ${
                        selectedImage === index
                          ? "ring-2 ring-gold"
                          : "hover:opacity-75"
                      }`}
                      style={{
                        backgroundImage: `url("${image}")`,
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-8 py-4">
              {/* Title & Price */}
              <div className="flex flex-col gap-3">
                <h1 className="font-display text-cream text-5xl font-bold leading-tight tracking-[-0.033em]">
                  {product.name}
                </h1>
                <p className="text-gold text-2xl font-normal leading-normal">
                  ${product.price.toFixed(2)}
                </p>
                {/* Stock Status */}
                {product.stock === 0 ? (
                  <span className="text-red-400 text-sm font-medium">
                    Out of Stock
                  </span>
                ) : product.stock < 10 ? (
                  <span className="text-orange-400 text-sm font-medium">
                    Only {product.stock} left in stock
                  </span>
                ) : (
                  <span className="text-green-400 text-sm font-medium">
                    In Stock
                  </span>
                )}
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-lg"
                        style={{
                          fontVariationSettings:
                            i < Math.floor(product.rating)
                              ? "'FILL' 1"
                              : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-cream/70 text-sm">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-bold text-cream uppercase tracking-wider">
                    SIZE: {selectedSize}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-sm font-medium leading-normal flex items-center justify-center rounded-lg border px-4 h-11 transition-all ${
                          selectedSize === size
                            ? "border-2 border-gold text-gold"
                            : "border-white/20 text-cream hover:border-gold/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-bold text-cream uppercase tracking-wider">
                    COLOR: {selectedColor}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`text-sm font-medium leading-normal flex items-center justify-center rounded-lg border px-4 h-11 transition-all ${
                          selectedColor === color
                            ? "border-2 border-gold text-gold"
                            : "border-white/20 text-cream hover:border-gold/50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex flex-col gap-4">
                <p className="text-sm font-bold text-cream uppercase tracking-wider">
                  QUANTITY
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.max(1, (isNaN(quantity) ? 1 : quantity) - 1)
                      )
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/20 text-cream hover:border-gold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-cream font-medium w-12 text-center">
                    {isNaN(quantity) ? 1 : quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          product?.stock || 999,
                          (isNaN(quantity) ? 1 : quantity) + 1
                        )
                      )
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/20 text-cream hover:border-gold transition-colors"
                    disabled={
                      (isNaN(quantity) ? 1 : quantity) >=
                      (product?.stock || 999)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-gold text-navy gap-2 text-base font-bold leading-normal tracking-wider uppercase min-w-0 px-6 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart
                    ? "Adding..."
                    : product.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  className={`flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isInWishlist(product.id)
                      ? "bg-gold/20 text-gold hover:bg-gold/30"
                      : "bg-white/10 text-cream hover:bg-white/20"
                  }`}
                  title={
                    isInWishlist(product.id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isInWishlist(product.id) ? "favorite" : "favorite_border"}
                  </span>
                </button>
              </div>
              {/* Product Details */}
              <div className="flex flex-col divide-y divide-white/20 border-y border-white/20">
                <details className="group py-4" open>
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-bold text-cream uppercase tracking-wider">
                      Product Description
                    </span>
                    <span className="material-symbols-outlined text-cream transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-cream/70 text-sm mt-3">
                    {product.description}
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-bold text-cream uppercase tracking-wider">
                      Product Details
                    </span>
                    <span className="material-symbols-outlined text-cream transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="text-cream/70 text-sm mt-3 space-y-2">
                    <p>
                      <span className="font-semibold text-cream">SKU:</span>{" "}
                      {product.sku}
                    </p>
                    <p>
                      <span className="font-semibold text-cream">
                        Category:
                      </span>{" "}
                      {product.category} - {product.subcategory}
                    </p>
                    {product.sizes && product.sizes.length > 0 && (
                      <p>
                        <span className="font-semibold text-cream">
                          Available Sizes:
                        </span>{" "}
                        {product.sizes.join(", ")}
                      </p>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <p>
                        <span className="font-semibold text-cream">
                          Available Colors:
                        </span>{" "}
                        {product.colors.join(", ")}
                      </p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <p>
                        <span className="font-semibold text-cream">Tags:</span>{" "}
                        {product.tags.join(", ")}
                      </p>
                    )}
                  </div>
                </details>
                <details className="group py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-base font-bold text-cream uppercase tracking-wider">
                      Shipping &amp; Returns
                    </span>
                    <span className="material-symbols-outlined text-cream transition-transform duration-300 group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-cream/70 text-sm mt-3">
                    Enjoy complimentary express shipping on all orders. We offer
                    a 30-day return policy for a full refund or exchange. Items
                    must be returned in their original condition.
                  </p>
                </details>
              </div>
            </div>
          </div>
          {/* Reviews Section */}
          <div className="mt-16 lg:mt-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="font-display text-3xl font-bold text-cream">
                Customer Reviews ({reviews.length})
              </h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 bg-white/10 text-cream gap-2 text-sm font-bold leading-normal tracking-wider uppercase min-w-0 px-5 hover:bg-white/20 transition-colors"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8 p-6 bg-white/5 rounded-xl">
                <h4 className="text-lg font-bold text-cream mb-4">
                  Write Your Review
                </h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-bold text-cream uppercase tracking-wider mb-2 block">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="text-3xl focus:outline-none transition-colors"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontVariationSettings:
                                star <= reviewRating ? "'FILL' 1" : "'FILL' 0",
                              color:
                                star <= reviewRating ? "#C9A961" : "#ffffff40",
                            }}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-cream uppercase tracking-wider mb-2 block">
                      Your Review
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-navy border border-white/20 text-cream placeholder-cream/50 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="self-start bg-gold text-navy px-6 py-3 rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-xl">
                <div className="flex flex-col gap-1 items-center">
                  <p className="text-4xl font-black text-cream">
                    {product.rating}
                  </p>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-lg"
                        style={{
                          fontVariationSettings:
                            i < Math.floor(product.rating)
                              ? "'FILL' 1"
                              : i < product.rating
                              ? "'FILL' 0.5"
                              : "'FILL' 0",
                        }}
                      >
                        {i < Math.floor(product.rating)
                          ? "star"
                          : i < product.rating
                          ? "star_half"
                          : "star"}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-cream/70">
                    Based on {product.reviewCount} reviews
                  </p>
                </div>
                <div className="w-px h-16 bg-slate-200 dark:bg-white/20 mx-4"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      5 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      20
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      4 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      3
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      3 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "5%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      1
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      2 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      0
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-12 text-slate-600 dark:text-gray-300">
                      1 star
                    </span>
                    <div className="w-full h-2 bg-slate-200 dark:bg-white/20 rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                    <span className="w-8 text-slate-500 dark:text-gray-400">
                      0
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-t border-slate-200 dark:border-white/20 pt-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gold/20 text-gold flex items-center justify-center rounded-full size-10 font-bold uppercase">
                        {review.userName.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 dark:text-white">
                              {review.userName}
                            </h4>
                            <div className="flex text-primary">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className="material-symbols-outlined text-base"
                                  style={{
                                    fontVariationSettings:
                                      i < review.rating
                                        ? "'FILL' 1"
                                        : "'FILL' 0",
                                  }}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-gray-400">
                            {review.createdAt
                              ?.toDate?.()
                              ?.toLocaleDateString() || "Recently"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-t border-slate-200 dark:border-white/20 pt-8 text-center">
                  <p className="text-cream/70">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-16 lg:mt-24">
            <h3 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-8">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link href="/products/5" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDJoLgdhvMHOdK8foYPdeA_Vod2bGKUvUwwRgDwTdwVmpcQ7HF7o2XmSdnqDmXF5QSFl0neQsJcVvE0I7zBmjNMDcjmmbm7sWjMcRaxLAPFZf3dIW56hgYxry7JDiLw1B_25SHnONbi1sC1Gc5ij20SeyLN5Vz_yHOWss0lcMJS7LV5bqx_o1VxI2l0pYgUy62QTjK0hniCJCWeQauUXC3bNY56ABZTXl3YgQCki2RvSk_rBsuL395knHctCvrGgZuccWXEdCAzXMc")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Aurelia Hoops
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $450.00
                  </p>
                </div>
              </Link>
              <Link href="/products/6" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBY0EwqGAWW16Go9idAreT2MWKE4FBbSDLD-m8nIGSIRqK8Mysq26kYw_JbJjGCR_W0t_Vq_0i1ROFHq9JWNN_2D-B7C-jtP_-P9OqarcLybVaY8350Vu4t-vo_5vFrBKLqbunOMH0WEEu6aPQSSjL1qDmVnYqLNwHaotGDfn06e-Ha5eal84LuemQLKLmUX340vpa-hyMNuRE-sVJGoCh8GSDgoccjZ0HjkmvRVUc2JZ435WstQw6o3ruGH340cJKrddWtMrsMthA")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Seraphina Clutch
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $980.00
                  </p>
                </div>
              </Link>
              <Link href="/products/7" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhoyJYxjevoQaqUpKfKwMSbE-XUKgx0DooJkmZ7BxfGVrcKmjpV2F1zqDpTbw2brIWi6O-e0Nq-lLpsuP_8uTHowdowf5365tM4MUNCwiRiQ_guGJx6CqF0l6vVYEKvy7XSMyXsuNyoChXjsaycLQ9-lUAIIEDWxYkzhNOWID-mfo4iTlY97jmeMLq4w6GZH2KSuGD01QzAgpVvBfnWT-05xpmEyCkdetW_BxXgFhvWckgevMp9YXoJ7w2z9v8pqhEH_XjshxiaZE")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Orion Silk Scarf
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $320.00
                  </p>
                </div>
              </Link>
              <Link href="/products/8" className="flex flex-col gap-3 group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWO9vCioKNKjgQTivLoqqJmqLHvQuXz4YBJzukPc4F_qMW9YbGpvpKiEOFksJg1gworLDpTgYqq46d9ti69rEYFAcLGFGE1iTbakvunVgZEDzCekw7bVU0JaveSMNJy8qkHk5dsy-QOAeyAkOywUG9xU4XwLuS5MvYPrZ47d0EBF3L7-ZTjCEdVsEsdsh_exp80aVuNOLV9whJ_8quCkIsrQdWxDHNXLHJQtj8aar77yS7audIl0sukatmFlUuXRbsM6TWgNBaMJw")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    Nyx Stilettos
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    $750.00
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
