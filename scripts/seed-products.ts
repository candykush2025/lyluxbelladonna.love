/**
 * Seed Products Script
 *
 * This script creates sample products in Firestore to get your store started.
 * Run: npx tsx scripts/seed-products.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sampleProducts = [
  {
    name: "Luxury Velvet Dress",
    description:
      "Elegant velvet dress perfect for special occasions. Features a sophisticated silhouette with premium fabric that drapes beautifully. Available in multiple colors.",
    price: 299.99,
    category: "Dresses",
    subcategory: "Evening Wear",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Emerald"],
    stock: 50,
    featured: true,
    status: "active",
    sku: "LVD-001",
    tags: ["luxury", "velvet", "evening", "formal"],
    rating: 4.8,
    reviewCount: 24,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Silk Blouse",
    description:
      "Premium silk blouse with classic collar and button front. Versatile piece that transitions from office to evening. Hand-washable silk.",
    price: 149.99,
    category: "Tops",
    subcategory: "Blouses",
    images: [
      "https://images.unsplash.com/photo-1564257577154-75fdab8e65d0?w=800",
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Ivory", "Blush", "Black"],
    stock: 75,
    featured: true,
    status: "active",
    sku: "SLK-BLS-001",
    tags: ["silk", "blouse", "elegant", "office"],
    rating: 4.6,
    reviewCount: 18,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Designer Handbag",
    description:
      "Luxurious leather handbag with gold-tone hardware. Features multiple compartments and adjustable strap. Perfect everyday luxury accessory.",
    price: 499.99,
    category: "Accessories",
    subcategory: "Handbags",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    ],
    sizes: ["One Size"],
    colors: ["Black", "Tan", "Burgundy"],
    stock: 30,
    featured: true,
    status: "active",
    sku: "DSG-BAG-001",
    tags: ["handbag", "leather", "luxury", "designer"],
    rating: 4.9,
    reviewCount: 42,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Cashmere Sweater",
    description:
      "100% pure cashmere sweater with ribbed trim. Ultra-soft and warm, perfect for layering or wearing alone. Dry clean only.",
    price: 279.99,
    category: "Sweaters",
    subcategory: "Knitwear",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Camel", "Black"],
    stock: 40,
    featured: false,
    status: "active",
    sku: "CSH-SWT-001",
    tags: ["cashmere", "sweater", "luxury", "winter"],
    rating: 4.7,
    reviewCount: 31,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Pearl Necklace",
    description:
      "Classic pearl necklace with sterling silver clasp. Features perfectly matched freshwater pearls. Includes presentation box.",
    price: 189.99,
    category: "Accessories",
    subcategory: "Jewelry",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    ],
    sizes: ["16 inch", "18 inch", "20 inch"],
    colors: ["White", "Cream"],
    stock: 25,
    featured: false,
    status: "active",
    sku: "PRL-NCK-001",
    tags: ["pearls", "necklace", "jewelry", "elegant"],
    rating: 4.8,
    reviewCount: 15,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Leather Pumps",
    description:
      "Classic leather pumps with pointed toe and stiletto heel. Cushioned insole for all-day comfort. Handcrafted Italian leather.",
    price: 349.99,
    category: "Shoes",
    subcategory: "Heels",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800",
    ],
    sizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"],
    colors: ["Black", "Nude", "Red"],
    stock: 60,
    featured: true,
    status: "active",
    sku: "LTH-PMP-001",
    tags: ["pumps", "heels", "leather", "classic"],
    rating: 4.5,
    reviewCount: 28,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Tailored Blazer",
    description:
      "Structured blazer with peaked lapels and single-button closure. Perfect for professional settings or elevated casual wear.",
    price: 329.99,
    category: "Outerwear",
    subcategory: "Blazers",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "Camel"],
    stock: 45,
    featured: false,
    status: "active",
    sku: "TLD-BLZ-001",
    tags: ["blazer", "tailored", "professional", "jacket"],
    rating: 4.7,
    reviewCount: 22,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Wide Leg Trousers",
    description:
      "High-waisted wide leg trousers with pleated front. Flowing silhouette in premium fabric blend. Side zip closure.",
    price: 179.99,
    category: "Bottoms",
    subcategory: "Trousers",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Olive", "Cream"],
    stock: 55,
    featured: false,
    status: "active",
    sku: "WLG-TRS-001",
    tags: ["trousers", "wide-leg", "high-waisted", "elegant"],
    rating: 4.6,
    reviewCount: 19,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function seedProducts() {
  console.log("🌱 Starting product seed...\n");

  try {
    // Sign in as admin user
    const adminEmail = process.argv[2] || "admin@lyluxbelladonna.com";
    const adminPassword = process.argv[3] || "SecureAdmin123!";

    console.log("🔐 Signing in as admin...");
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log("✅ Signed in successfully\n");

    const productsRef = collection(db, "products");
    let successCount = 0;
    let errorCount = 0;

    for (const product of sampleProducts) {
      try {
        const docRef = await addDoc(productsRef, product);
        console.log(`✅ Created: ${product.name} (ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create ${product.name}:`, error);
        errorCount++;
      }
    }

    console.log("\n📊 Seed Summary:");
    console.log(`✅ Successfully created: ${successCount} products`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} products`);
    }
    console.log("\n🎉 Product seeding complete!");
    console.log("\nNext steps:");
    console.log("1. Visit Firebase Console → Firestore to view your products");
    console.log("2. Start your dev server: npm run dev");
    console.log("3. Visit the products page to see dynamic products");

    process.exit(0);
  } catch (error) {
    console.error("💥 Fatal error during seeding:", error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
