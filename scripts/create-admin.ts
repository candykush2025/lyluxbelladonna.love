// scripts/create-admin.ts
// This script helps you create the first admin user
// Run with: npx tsx scripts/create-admin.ts

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { config } from "dotenv";
import { resolve } from "path";

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

async function createAdmin() {
  const email = process.argv[2] || "admin@lyluxbelladonna.com";
  const password = process.argv[3] || "Admin123!";
  const displayName = process.argv[4] || "Admin";

  try {
    console.log("Creating admin user...");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Name:", displayName);

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✓ User created in Firebase Auth");
    console.log("UID:", user.uid);

    // Update profile
    await updateProfile(user, { displayName });
    console.log("✓ Profile updated");

    // Create user document in Firestore with admin role
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role: "admin", // 👈 ADMIN ROLE
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        phone: "",
        addresses: [],
      },
    });

    console.log("✓ Admin user document created in Firestore");
    console.log("\n🎉 Admin user created successfully!");
    console.log("\nYou can now login at: http://localhost:3000/admin/login");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
}

createAdmin();
