# Quick Start Guide - Firebase E-Commerce System

## 🚀 What's Been Done

✅ **Firebase installed and configured**  
✅ **Authentication system created** (Customer & Admin login/register)  
✅ **Helper libraries built** (auth, firestore, storage)  
✅ **AuthContext for global state**

## 📍 Current Status

**You can now:**

- Register new customer accounts at `/register`
- Login customers at `/login`
- Login admins at `/admin/login`

**But you need to:**

1. Add `AuthProvider` to your app
2. Setup Firestore database
3. Create your first admin user

---

## 🔥 Step-by-Step Setup

### 1. Add AuthProvider (Required!)

Open `app/layout.tsx` and wrap your app with `AuthProvider`:

```tsx
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Your existing Header */}
          {children}
          {/* Your existing Footer */}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Setup Firebase Firestore

Go to [Firebase Console](https://console.firebase.google.com/):

1. Select your project: **lyluxbelladonna**
2. Go to **Firestore Database**
3. Click **Create Database**
4. Start in **Test Mode** (we'll add security rules later)
5. Choose your region (closest to your users)

### 3. Create Collections

Create these collections in Firestore:

- `users` - User profiles and roles
- `products` - Product catalog
- `orders` - Customer orders
- `carts` - Shopping carts
- `wishlists` - Customer wishlists

### 4. Create Your First Admin User

**Option A: Firebase Console (Easy)**

1. Go to Authentication → Users → Add User
2. Email: `admin@lyluxbelladonna.com`
3. Password: (choose a strong password)
4. Copy the User UID
5. Go to Firestore → users collection → Add Document
6. Document ID: (paste the UID)
7. Fields:

```
uid: (same UID)
email: admin@lyluxbelladonna.com
displayName: Admin
role: admin
createdAt: (current timestamp)
updatedAt: (current timestamp)
```

**Option B: Code (Automated)**

```typescript
// Run this once to create admin
import { registerCustomer } from "@/lib/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Register as customer first
const result = await registerCustomer(
  "admin@lyluxbelladonna.com",
  "your-secure-password",
  "Admin"
);

// Then update to admin role
if (result.success && result.user) {
  await updateDoc(doc(db, "users", result.user.uid), {
    role: "admin",
  });
}
```

---

## 🧪 Test Your Setup

### Test Customer Auth

1. Go to `http://localhost:3001/register`
2. Create a test account
3. Check if redirected to `/account`
4. Check Firebase Console → Authentication (user should appear)
5. Check Firestore → users (document should exist with role: "customer")

### Test Admin Auth

1. Go to `http://localhost:3001/admin/login`
2. Login with admin credentials
3. Should redirect to `/admin` dashboard
4. Try logging in with customer account → should be denied

---

## 🔧 Using Auth in Your Components

### Get Current User

```typescript
"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, userProfile, loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {userProfile?.displayName}!</p>
      {isAdmin && <p>You are an admin</p>}
    </div>
  );
}
```

### Logout

```typescript
import { logoutUser } from "@/lib/auth";

const handleLogout = async () => {
  const result = await logoutUser();
  if (result.success) {
    router.push("/");
  }
};
```

### Check if Logged In

```typescript
const { user } = useAuth();

if (user) {
  // User is logged in
} else {
  // User is not logged in
}
```

---

## 📦 Working with Products

### Get All Products

```typescript
import { getProducts } from "@/lib/firestore";

const products = await getProducts();
```

### Get Single Product

```typescript
import { getProduct } from "@/lib/firestore";

const product = await getProduct("product-id");
```

### Create Product (Admin)

```typescript
import { createProduct } from "@/lib/firestore";

const productId = await createProduct({
  name: "Evening Gown",
  price: 1250,
  category: "Clothing",
  stock: 10,
  description: "Elegant evening gown...",
  images: [],
  sizes: ["S", "M", "L"],
  colors: ["Black", "Navy"],
  status: "active",
});
```

### Upload Product Images

```typescript
import { uploadImages } from "@/lib/storage";

const files = [file1, file2, file3]; // From input type="file"
const imageUrls = await uploadImages(files, "products/product-id");
// Returns array of download URLs
```

---

## 🛒 Working with Cart

### Get User Cart

```typescript
import { getCart } from "@/lib/firestore";

const cart = await getCart(userId);
// Returns: { items: [...] }
```

### Update Cart

```typescript
import { updateCart } from "@/lib/firestore";

await updateCart(userId, [
  { productId: "prod-1", quantity: 2, size: "M", color: "Black" },
  { productId: "prod-2", quantity: 1, size: "L", color: "White" },
]);
```

---

## 📋 Working with Orders

### Create Order

```typescript
import { createOrder } from "@/lib/firestore";

const { id, orderNumber } = await createOrder({
  userId: user.uid,
  customerEmail: user.email,
  customerName: userProfile.displayName,
  items: cartItems,
  subtotal: 100,
  tax: 10,
  shipping: 5,
  total: 115,
  status: "pending",
  paymentStatus: "pending",
  shippingAddress: {
    /* ... */
  },
});

// orderNumber will be like: ORD-1731621234567-123
```

### Get User Orders

```typescript
import { getOrders } from "@/lib/firestore";

const orders = await getOrders(userId);
```

### Get All Orders (Admin)

```typescript
const allOrders = await getOrders(); // No userId = all orders
```

---

## 🔐 Security Rules (Add to Firestore)

Go to Firestore → Rules tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Products
    match /products/{productId} {
      allow read: if true; // Public
      allow write: if isAdmin();
    }

    // Orders
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Carts
    match /carts/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Wishlists
    match /wishlists/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

---

## 🐛 Common Issues

### "Firebase app not initialized"

- Make sure you restart dev server after adding `.env.local`
- Check all env variables are prefixed with `NEXT_PUBLIC_`

### "Permission denied" in Firestore

- Add security rules (see above)
- Check user role in Firestore users collection

### Admin login says "Access denied"

- Check Firestore → users → (your uid) → role should be "admin"
- Make sure you're using the admin login at `/admin/login`

### Can't upload images

- Go to Firebase Console → Storage
- Create a bucket if not exists
- Update storage rules to allow authenticated users to write

---

## 📚 Next Steps

1. ✅ Setup complete
2. 🔄 Test authentication flows
3. 🔄 Add sample products to Firestore
4. 🔄 Connect product pages to Firebase
5. 🔄 Build shopping cart functionality
6. 🔄 Create checkout flow
7. 🔄 Test order creation
8. 🔄 Connect admin dashboard to real data

---

## 🆘 Need Help?

Check these files for reference:

- `ONLINE_SHOP_SYSTEM_TODO.md` - Complete feature list
- `FIREBASE_IMPLEMENTATION_STATUS.md` - Detailed progress
- `lib/firestore.ts` - All database functions
- `lib/auth.ts` - All auth functions

**Good luck building your e-commerce empire! 🚀**
