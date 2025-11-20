/**
 * Seed Homepage Content Script
 *
 * This script creates the initial homepage content in Firestore.
 * Run: npx tsx scripts/seed-homepage.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

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

const homepageContent = {
  hero: {
    title: "The Autumnal Equinox",
    subtitle:
      "Discover timeless elegance and modern sophistication in our latest arrivals.",
    backgroundImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJRymbQDgxn-tAYCA49tAWa0W8GS1wcpT8Xa2sxft5d2ql7ZFYzEGmLVXuvm5BPJUQyMvL7UHUEAvQq9JTtFqw7rBd21CjsYv-_p4gaxJvG22pRAtdSHmp7ta2TwDUjbpreD3_MjMfOrB63wlfGu-USMpiKCeYemgJ7pwfADXLNz4RESBmeWH-szbhJfQ7xLowtM3db6l_Mjb0jUPNnGrmlfM-xkdSGzjh55nAfEScdSZXn6OIMM39oAzlr7WIFtsbclk_owxs0iE",
    shopNowText: "Shop Now",
  },
  collections: [
    {
      id: "evening-edit",
      title: "The Evening Edit",
      subtitle: "Shop Collection",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ducnJ8AmXCNRgW7Rc74jnAwSjG0xWJlnEWnlOr_hVZt7lhrsh7jghy3K5cKBb3NGlmfyuwtofkmEBwZRklNiJeY7_5_oEke3SI8820_c_HvQEQZO9266_s3uDoNqzuvsb_aCcC6pZmb2f9_ABcfhfVJGtfo9U2nQS8SwSEWjV2c7IzA-yp0oBo9fpl_P8qT9L-AU8FBCTXa2kU78sZ-b9SFrRrziragFUszlYHFaxiYNAAoP0pLzdp6Fok1xyIM0WvsfQHvTN0",
      link: "/products",
    },
    {
      id: "artisan-leather",
      title: "Artisan Leather",
      subtitle: "Shop Collection",
      backgroundImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDpY63pOULIh0ykCEQ3__5GYxAqX4f6xWY4KV5ORKPkoZW7SJzkR_GJ5VimZvBY7YfbCSLohFxDpJjc1wwIxNHo7CO1FS7kPGZhieKzHpoxDHXZzoc9SalATd4x5dUSOIM_Gx4BCJ5JNPQrhvE72BKVjY4cxUlNhY4E5d-VtNLXUZC9PTiTnuF3xaXSaxkEdTPsO1iiz36KbWe1yOgR97_GA3BJGc5LB_a105xVU8UItQ4RatFtnW7tDXuFyR1xHLHXWEmu9ZKhvEM",
      link: "/products",
    },
  ],
  craft: {
    title: "The Art of Craft",
    description:
      "At Lylux Belladonna, we believe in the enduring power of craftsmanship. Each piece is meticulously designed and created with the finest materials, blending traditional techniques with a modern sensibility to create not just clothing, but timeless art.",
    buttonText: "Discover Our Philosophy",
    buttonLink: "/about",
  },
  updatedAt: Timestamp.now(),
};

async function seedHomepageContent() {
  try {
    console.log("🌱 Seeding homepage content...");

    // Sign in with admin credentials (you'll need to create an admin user first)
    // For now, we'll assume the content can be set without authentication
    // In production, you should authenticate as an admin user

    const docRef = doc(db, "homepage", "content");
    await setDoc(docRef, homepageContent);

    console.log("✅ Homepage content seeded successfully!");
    console.log("📄 Content ID: content");
  } catch (error) {
    console.error("❌ Error seeding homepage content:", error);
    process.exit(1);
  }
}

// Run the script
seedHomepageContent();
