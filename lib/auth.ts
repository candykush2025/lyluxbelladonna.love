// lib/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "customer" | "admin";
  createdAt: any;
  updatedAt: any;
  profile?: {
    phone?: string;
    addresses?: any[];
  };
}

// Register new customer
export const registerCustomer = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        phone: "",
        addresses: [],
      },
    });

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Admin login with role check
export const loginAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check if user has admin role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Create admin user if it doesn't exist (for default admin)
      if (email === "testadmin@example.com") {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: "Admin User",
          role: "admin",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        return { success: true, user };
      } else {
        await signOut(auth);
        return {
          success: false,
          error: "Access denied. Admin privileges required.",
        };
      }
    }

    if (userDoc.data().role !== "admin") {
      await signOut(auth);
      return {
        success: false,
        error: "Access denied. Admin privileges required.",
      };
    }

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get user profile from Firestore
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Check if user is admin
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    return userDoc.exists() && userDoc.data().role === "admin";
  } catch (error) {
    return false;
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  displayName: string,
  profileData: any
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No user logged in" };
    }

    // Update Firebase Auth profile
    await updateProfile(user, { displayName });

    // Update Firestore document
    await updateDoc(doc(db, "users", uid), {
      displayName,
      profile: profileData,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return { success: false, error: "No user logged in" };
    }

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return { success: true };
  } catch (error: any) {
    if (error.code === "auth/wrong-password") {
      return { success: false, error: "Current password is incorrect" };
    }
    return { success: false, error: error.message };
  }
};
