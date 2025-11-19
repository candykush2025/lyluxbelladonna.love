"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

// JWT and localStorage constants
const JWT_STORAGE_KEY = "auth_jwt";
const USER_STORAGE_KEY = "auth_user";
const PROFILE_STORAGE_KEY = "auth_profile";
const LOGOUT_MARKER_KEY = "auth_logout_marker";
const JWT_EXPIRY_HOURS = 24; // 1 day

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jwtLoaded, setJwtLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // JWT helper functions
  const generateJWT = (userId: string): string => {
    const payload = {
      userId,
      exp: Date.now() + JWT_EXPIRY_HOURS * 60 * 60 * 1000, // 1 day from now
      iat: Date.now(),
    };
    return btoa(JSON.stringify(payload)); // Simple base64 encoding
  };

  const validateJWT = (token: string): { userId: string } | null => {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        return null; // Token expired
      }
      return { userId: payload.userId };
    } catch {
      return null; // Invalid token
    }
  };

  // Save auth state to localStorage
  const saveAuthState = (user: User, profile: UserProfile) => {
    try {
      // Remove any logout marker when saving a fresh auth state
      localStorage.removeItem(LOGOUT_MARKER_KEY);

      const jwt = generateJWT(user.uid);
      localStorage.setItem(JWT_STORAGE_KEY, jwt);
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        })
      );
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      console.log("Auth state saved to localStorage");
    } catch (error) {
      console.error("Error saving auth state:", error);
    }
  };

  // Clear auth state from localStorage
  const clearAuthStorage = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    // keep logout marker if present so other tabs/instances know we intentionally logged out
    console.log("Auth state cleared from localStorage");
  };

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        // Don't restore if user is logging out or if a recent logout marker exists
        if (isLoggingOut) {
          setLoading(false);
          return;
        }

        const logoutMarker = localStorage.getItem(LOGOUT_MARKER_KEY);
        if (logoutMarker) {
          // If logout marker set within the last 5 minutes, do not auto-restore
          const ts = parseInt(logoutMarker, 10);
          if (!Number.isNaN(ts)) {
            const age = Date.now() - ts;
            const BLOCK_MS = 1000 * 60 * 5; // 5 minutes
            if (age < BLOCK_MS) {
              console.log("Recent logout marker found, skipping auto-restore");
              setLoading(false);
              return;
            } else {
              // marker expired; remove it
              localStorage.removeItem(LOGOUT_MARKER_KEY);
            }
          }
        }

        const storedJWT = localStorage.getItem(JWT_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

        if (storedJWT && storedUser) {
          const jwtData = validateJWT(storedJWT);
          if (jwtData) {
            // JWT is valid, restore auth state
            const userData = JSON.parse(storedUser);
            const profileData = storedProfile
              ? JSON.parse(storedProfile)
              : null;

            setUser(userData);
            setUserProfile(profileData);
            setIsAdmin(profileData?.role === "admin");
            setJwtLoaded(true);

            console.log("Auth state restored from localStorage");
          } else {
            // JWT expired, clear storage
            clearAuthStorage();
            console.log("JWT expired, clearing auth state");
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        clearAuthStorage();
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, [isLoggingOut]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        setUser(firebaseUser);

        // Fetch user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
        setIsAdmin(profile?.role === "admin");

        // Save to localStorage for persistence
        if (profile) {
          saveAuthState(firebaseUser, profile);
        }
        setJwtLoaded(true);
      } else {
        // User is signed out from Firebase
        // Clear local state if JWT wasn't loaded OR if user is logging out
        if (!jwtLoaded || isLoggingOut) {
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
          clearAuthStorage();
          setIsLoggingOut(false); // Reset the flag
        }
        // If we have JWT data and not logging out, keep it (user might just be offline)
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [jwtLoaded, isLoggingOut]);

  const logout = async () => {
    try {
      // Mark that a logout happened recently so other instances/tabs won't auto-restore
      localStorage.setItem(LOGOUT_MARKER_KEY, Date.now().toString());

      // Clear all other auth localStorage data FIRST (before any state changes)
      clearAuthStorage();

      // Set logging out flag
      setIsLoggingOut(true);

      // Reset local state immediately
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      setJwtLoaded(false);

      // Sign out from Firebase
      await signOut(auth);

      console.log(
        "User logged out successfully - all data cleared (logout marker set)"
      );
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false); // Reset flag on error
      throw error;
    } finally {
      // Reset flag after everything is done
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, isAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
