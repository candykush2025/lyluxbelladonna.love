// lib/firestore.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Product operations
export const getProducts = async (constraints: QueryConstraint[] = []) => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const createProduct = async (data: DocumentData) => {
  const productsRef = collection(db, "products");
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, data: DocumentData) => {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
};

// Order operations
export const getOrders = async (userId?: string) => {
  const ordersRef = collection(db, "orders");
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

  if (userId) {
    constraints.unshift(where("userId", "==", userId));
  }

  const q = query(ordersRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getOrder = async (id: string) => {
  const docRef = doc(db, "orders", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const createOrder = async (data: DocumentData) => {
  const ordersRef = collection(db, "orders");
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const docRef = await addDoc(ordersRef, {
    ...data,
    orderNumber,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return { id: docRef.id, orderNumber };
};

export const updateOrder = async (id: string, data: DocumentData) => {
  const docRef = doc(db, "orders", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// User operations
export const getUser = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const createUser = async (uid: string, data: DocumentData) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateUser = async (uid: string, data: DocumentData) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// Cart operations
export const getCart = async (userId: string) => {
  const docRef = doc(db, "carts", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return { items: [] };
};

export const updateCart = async (userId: string, items: any[]) => {
  const docRef = doc(db, "carts", userId);
  await setDoc(
    docRef,
    {
      items,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

// Wishlist operations
export const getWishlist = async (userId: string) => {
  const docRef = doc(db, "wishlists", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return { items: [] };
};

export const updateWishlist = async (userId: string, items: any[]) => {
  const docRef = doc(db, "wishlists", userId);
  await setDoc(
    docRef,
    {
      items,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

// Review operations
export const getReviews = async (productId: string) => {
  const reviewsRef = collection(db, "reviews");
  const q = query(
    reviewsRef,
    where("productId", "==", productId),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getAllReviews = async () => {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createReview = async (data: DocumentData) => {
  const reviewsRef = collection(db, "reviews");
  const docRef = await addDoc(reviewsRef, {
    ...data,
    status: "pending",
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateReview = async (id: string, data: DocumentData) => {
  const docRef = doc(db, "reviews", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteReview = async (id: string) => {
  const docRef = doc(db, "reviews", id);
  await deleteDoc(docRef);
};

// Customer operations
export const getCustomers = async () => {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("role", "==", "customer"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Brand operations
export const getBrands = async () => {
  const brandsRef = collection(db, "brands");
  const q = query(brandsRef, orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getBrand = async (id: string) => {
  const docRef = doc(db, "brands", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const createBrand = async (data: DocumentData) => {
  const brandsRef = collection(db, "brands");
  const docRef = await addDoc(brandsRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return { id: docRef.id, ...data };
};

export const updateBrand = async (id: string, data: DocumentData) => {
  const docRef = doc(db, "brands", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteBrand = async (id: string) => {
  const docRef = doc(db, "brands", id);
  await deleteDoc(docRef);
};
