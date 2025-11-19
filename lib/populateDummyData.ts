// Dummy data population functions for Firebase
// Run these functions to populate your database with test data

import { db, auth } from "./firebase";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Sample product data
const sampleProducts = [
  {
    name: "Luxury Silk Dress",
    description:
      "Elegant silk dress perfect for special occasions. Made from the finest Italian silk with intricate detailing.",
    price: 1200,
    category: "Dresses",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    ],
    inStock: true,
    featured: true,
    tags: ["silk", "luxury", "evening"],
    createdAt: Timestamp.fromDate(new Date("2024-10-01")),
  },
  {
    name: "Designer Handbag",
    description:
      "Premium leather handbag crafted by master artisans. Features gold hardware and spacious interior.",
    price: 800,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    inStock: true,
    featured: true,
    tags: ["leather", "designer", "handbag"],
    createdAt: Timestamp.fromDate(new Date("2024-10-05")),
  },
  {
    name: "Premium Jewelry Set",
    description:
      "Stunning diamond and gold jewelry set including necklace, earrings, and bracelet.",
    price: 1500,
    category: "Jewelry",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    ],
    inStock: true,
    featured: false,
    tags: ["diamonds", "gold", "jewelry"],
    createdAt: Timestamp.fromDate(new Date("2024-10-10")),
  },
  {
    name: "Evening Gown",
    description:
      "Breathtaking evening gown with flowing silhouette and crystal embellishments.",
    price: 1800,
    category: "Dresses",
    images: [
      "https://images.unsplash.com/photo-1566479179815-4cf3b8b4a6b8?w=500",
    ],
    inStock: true,
    featured: true,
    tags: ["evening", "crystals", "formal"],
    createdAt: Timestamp.fromDate(new Date("2024-10-15")),
  },
  {
    name: "Crystal Earrings",
    description:
      "Delicate crystal drop earrings that catch the light beautifully.",
    price: 400,
    category: "Jewelry",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
    ],
    inStock: true,
    featured: false,
    tags: ["crystals", "earrings", "delicate"],
    createdAt: Timestamp.fromDate(new Date("2024-10-20")),
  },
  {
    name: "Designer Watch",
    description: "Elegant timepiece with Swiss movement and diamond bezel.",
    price: 1200,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
    ],
    inStock: true,
    featured: false,
    tags: ["watch", "swiss", "diamonds"],
    createdAt: Timestamp.fromDate(new Date("2024-10-25")),
  },
  {
    name: "Luxury Perfume",
    description:
      "Exquisite fragrance with notes of jasmine, vanilla, and musk.",
    price: 300,
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500",
    ],
    inStock: true,
    featured: false,
    tags: ["perfume", "luxury", "fragrance"],
    createdAt: Timestamp.fromDate(new Date("2024-11-01")),
  },
  {
    name: "Silk Scarf",
    description:
      "Soft silk scarf with artistic print, perfect for adding elegance to any outfit.",
    price: 250,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=500",
    ],
    inStock: true,
    featured: false,
    tags: ["silk", "scarf", "artistic"],
    createdAt: Timestamp.fromDate(new Date("2024-11-05")),
  },
  {
    name: "Designer Shoes",
    description:
      "Stiletto heels crafted from premium leather with comfortable fit.",
    price: 900,
    category: "Shoes",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"],
    inStock: true,
    featured: true,
    tags: ["heels", "leather", "designer"],
    createdAt: Timestamp.fromDate(new Date("2024-11-10")),
  },
  {
    name: "Evening Clutch",
    description:
      "Sophisticated clutch bag perfect for formal events and evenings out.",
    price: 600,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    inStock: true,
    featured: false,
    tags: ["clutch", "evening", "formal"],
    createdAt: Timestamp.fromDate(new Date("2024-11-15")),
  },
];
const sampleCustomers = [
  {
    email: "isabella@example.com",
    displayName: "Isabella Dubois",
    role: "customer",
    createdAt: Timestamp.fromDate(new Date("2025-01-15")),
  },
  {
    email: "sophie@example.com",
    displayName: "Sophie Laurent",
    role: "customer",
    createdAt: Timestamp.fromDate(new Date("2025-02-10")),
  },
  {
    email: "emma@example.com",
    displayName: "Emma Wilson",
    role: "customer",
    createdAt: Timestamp.fromDate(new Date("2024-12-05")),
  },
  {
    email: "olivia@example.com",
    displayName: "Olivia Chen",
    role: "customer",
    createdAt: Timestamp.fromDate(new Date("2025-03-20")),
  },
  {
    email: "aria@example.com",
    displayName: "Aria Martinez",
    role: "customer",
    createdAt: Timestamp.fromDate(new Date("2024-10-12")),
  },
];

// Sample order data
const sampleOrders = [
  {
    userId: "", // Will be set after creating customers
    email: "isabella@example.com",
    orderNumber: "ORD-1001",
    items: [
      {
        productId: "prod1",
        name: "Luxury Silk Dress",
        quantity: 1,
        price: 1200,
      },
      { productId: "prod2", name: "Designer Handbag", quantity: 1, price: 800 },
    ],
    total: 2000,
    status: "completed",
    createdAt: Timestamp.fromDate(new Date("2025-01-20")),
  },
  {
    userId: "", // Will be set after creating customers
    email: "sophie@example.com",
    orderNumber: "ORD-1002",
    items: [
      {
        productId: "prod3",
        name: "Premium Jewelry Set",
        quantity: 1,
        price: 1500,
      },
    ],
    total: 1500,
    status: "processing",
    createdAt: Timestamp.fromDate(new Date("2025-02-15")),
  },
  {
    userId: "", // Will be set after creating customers
    email: "emma@example.com",
    orderNumber: "ORD-1003",
    items: [
      { productId: "prod4", name: "Evening Gown", quantity: 2, price: 1800 },
      { productId: "prod5", name: "Crystal Earrings", quantity: 1, price: 400 },
    ],
    total: 4000,
    status: "shipped",
    createdAt: Timestamp.fromDate(new Date("2024-12-10")),
  },
  {
    userId: "", // Will be set after creating customers
    email: "olivia@example.com",
    orderNumber: "ORD-1004",
    items: [
      { productId: "prod6", name: "Designer Watch", quantity: 1, price: 1200 },
    ],
    total: 1200,
    status: "completed",
    createdAt: Timestamp.fromDate(new Date("2025-03-25")),
  },
  {
    userId: "", // Will be set after creating customers
    email: "aria@example.com",
    orderNumber: "ORD-1005",
    items: [
      { productId: "prod7", name: "Luxury Perfume", quantity: 3, price: 300 },
      { productId: "prod8", name: "Silk Scarf", quantity: 2, price: 250 },
      { productId: "prod9", name: "Designer Shoes", quantity: 1, price: 900 },
    ],
    total: 2900,
    status: "completed",
    createdAt: Timestamp.fromDate(new Date("2024-10-15")),
  },
  {
    userId: "", // Will be set after creating customers
    email: "aria@example.com",
    orderNumber: "ORD-1006",
    items: [
      { productId: "prod10", name: "Evening Clutch", quantity: 1, price: 600 },
    ],
    total: 600,
    status: "processing",
    createdAt: Timestamp.fromDate(new Date("2024-11-20")),
  },
];

// Function to create a test user account
export const createTestUser = async (
  email: string,
  password: string,
  displayName: string = "Test User"
) => {
  try {
    console.log(`Creating test user: ${email}`);

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user document in Firestore
    const userDoc = {
      email: user.email,
      displayName: displayName,
      role: "customer",
      createdAt: Timestamp.now(),
      uid: user.uid,
    };

    await setDoc(doc(db, "users", user.uid), userDoc);

    // Sign out the test user (we don't want to stay logged in as them)
    await signOut(auth);

    console.log(`Test user created successfully: ${email} (${user.uid})`);
    return { uid: user.uid, email: user.email };
  } catch (error) {
    console.error("Error creating test user:", error);
    throw error;
  }
};

// Function to populate customers
export const populateCustomers = async () => {
  try {
    const customerIds: { [email: string]: string } = {};

    for (const customer of sampleCustomers) {
      const docRef = await addDoc(collection(db, "users"), customer);
      customerIds[customer.email] = docRef.id;
      console.log(`Created customer: ${customer.displayName} (${docRef.id})`);
    }

    return customerIds;
  } catch (error) {
    console.error("Error populating customers:", error);
    throw error;
  }
};

// Function to populate products
export const populateProducts = async () => {
  try {
    for (const product of sampleProducts) {
      await addDoc(collection(db, "products"), product);
      console.log(`Created product: ${product.name}`);
    }
  } catch (error) {
    console.error("Error populating products:", error);
    throw error;
  }
};

// Function to populate orders
export const populateOrders = async (customerIds: {
  [email: string]: string;
}) => {
  try {
    for (const order of sampleOrders) {
      const orderWithUserId = {
        ...order,
        userId: customerIds[order.email],
      };

      await addDoc(collection(db, "orders"), orderWithUserId);
      console.log(`Created order: ${order.orderNumber} for ${order.email}`);
    }
  } catch (error) {
    console.error("Error populating orders:", error);
    throw error;
  }
};

// Main function to populate all dummy data
export const populateDummyData = async () => {
  try {
    console.log("Starting dummy data population...");

    // Create products first
    await populateProducts();

    // Create customers
    const customerIds = await populateCustomers();

    // Create orders with customer IDs
    await populateOrders(customerIds);

    console.log("Dummy data population completed successfully!");
  } catch (error) {
    console.error("Error in dummy data population:", error);
    throw error;
  }
};
