# Firebase Setup Guide - Step by Step

**Complete this checklist to get your online shop running!**

---

## ✅ Step 1: Firebase Console Setup (5 minutes)

### A. Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **lyluxbelladonna**
3. Click **Firestore Database** in the left menu
4. Click **Create Database**
5. Select **Start in test mode** (we'll add security rules later)
6. Choose your region (e.g., `us-central1` or closest to your users)
7. Click **Enable**

### B. Enable Firebase Storage

1. In Firebase Console, click **Storage** in the left menu
2. Click **Get Started**
3. Click **Next** on security rules (we'll add them later)
4. Choose same region as Firestore
5. Click **Done**

### C. Enable Firebase Authentication

1. In Firebase Console, click **Authentication** in the left menu
2. Click **Get Started**
3. Click on **Email/Password** under Sign-in providers
4. Toggle **Enable** on
5. Click **Save**

---

## ✅ Step 2: Deploy Security Rules (2 minutes)

### Option A: Firebase Console (Easy)

**Firestore Rules:**

1. Go to **Firestore Database** → **Rules** tab
2. Delete existing rules
3. Copy content from `firestore.rules` file in your project
4. Paste into the editor
5. Click **Publish**

**Storage Rules:**

1. Go to **Storage** → **Rules** tab
2. Delete existing rules
3. Copy content from `storage.rules` file in your project
4. Paste into the editor
5. Click **Publish**

### Option B: Firebase CLI (Advanced)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select: Firestore, Storage
# Deploy rules
firebase deploy --only firestore:rules,storage:rules
```

---

## ✅ Step 3: Create Your First Admin User (2 minutes)

### Option A: Using the Script (Recommended)

```bash
# Install tsx for running TypeScript scripts
npm install -D tsx

# Run the create-admin script
npx tsx scripts/create-admin.ts

# Or with custom credentials:
npx tsx scripts/create-admin.ts admin@youremail.com YourPassword123! AdminName
```

### Option B: Manual Creation (Firebase Console)

**Part 1: Create Auth User**

1. Go to **Authentication** → **Users** tab
2. Click **Add User**
3. Email: `admin@lyluxbelladonna.com`
4. Password: Choose a strong password
5. Click **Add User**
6. **Copy the User UID** (you'll need it in Part 2)

**Part 2: Create Firestore Document**

1. Go to **Firestore Database** → **Data** tab
2. Click **Start Collection**
3. Collection ID: `users`
4. Click **Next**
5. Document ID: (paste the UID from Part 1)
6. Add these fields:

| Field       | Type      | Value                       |
| ----------- | --------- | --------------------------- |
| uid         | string    | (paste UID)                 |
| email       | string    | admin@lyluxbelladonna.com   |
| displayName | string    | Admin                       |
| role        | string    | **admin** ← IMPORTANT!      |
| createdAt   | timestamp | (click "Current timestamp") |
| updatedAt   | timestamp | (click "Current timestamp") |

7. Click **Save**

---

## ✅ Step 4: Test Authentication (5 minutes)

### Test Customer Registration

1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:3000/register`
3. Create a test customer account
4. Should redirect to `/account` page
5. Check Firebase Console:
   - **Authentication** → User should appear
   - **Firestore** → `users` collection → Document with role: "customer"

### Test Customer Login

1. Go to: `http://localhost:3000/login`
2. Login with the customer account you just created
3. Should redirect to `/account`
4. Click logout icon in header
5. Should redirect to home page

### Test Admin Login

1. Go to: `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Should redirect to `/admin` dashboard
4. Try logging in with customer account → Should be denied

### Test Password Reset

1. Go to: `http://localhost:3000/forgot-password`
2. Enter email address
3. Check your email for reset link
4. Click link and set new password

---

## ✅ Step 5: Verify Firestore Collections (2 minutes)

Go to Firestore Database in Firebase Console. You should see:

### Created Automatically:

- ✅ **users** - Has your admin user and test customer

### Need to Create Manually (for now):

Go to Firestore → **Start Collection** for each:

1. **products** collection (empty for now)
2. **orders** collection (empty for now)
3. **carts** collection (empty for now)
4. **wishlists** collection (empty for now)

---

## ✅ Step 6: Test Protected Routes (3 minutes)

### Test Customer Protection

1. Make sure you're logged out
2. Try to visit: `http://localhost:3000/account`
3. Should redirect to `/login`
4. Login and try again
5. Should show account page

### Test Admin Protection

1. Login as customer
2. Try to visit: `http://localhost:3000/admin`
3. Should redirect to `/admin/login`
4. Logout and login as admin
5. Should show admin dashboard

---

## ✅ Step 7: Verify Header Navigation (1 minute)

### When Logged Out:

- Should see: Login icon, Cart icon

### When Logged In (Customer):

- Should see: Account icon, Cart icon, Logout icon

### When Logged In (Admin):

- Should see: Account icon, Cart icon, Admin icon, Logout icon

---

## 🎉 Setup Complete!

Your authentication system is fully functional!

### What Works Now:

✅ Customer registration  
✅ Customer login  
✅ Admin login with role verification  
✅ Password reset  
✅ Protected routes  
✅ Firestore security rules  
✅ Storage security rules  
✅ Session persistence  
✅ Logout functionality

### Next Steps:

1. Add sample products to Firestore
2. Connect product pages to Firestore
3. Build shopping cart with Firebase
4. Create checkout flow
5. Connect admin dashboard to real data

---

## 📝 Important Credentials

Save these securely!

**Admin Login:**

- URL: `http://localhost:3000/admin/login`
- Email: (the admin email you created)
- Password: (the password you set)

**Firebase Console:**

- URL: https://console.firebase.google.com/project/lyluxbelladonna
- Use your Google account credentials

---

## 🐛 Troubleshooting

### "Permission Denied" errors

- Make sure you deployed Firestore security rules
- Check that admin user has `role: "admin"` in Firestore
- Clear browser cache and try again

### Can't login as admin

- Verify user exists in **Authentication**
- Verify user document exists in **Firestore** → users
- Check that `role` field is set to `"admin"` (not "Admin" or "ADMIN")
- Try password reset if needed

### Header doesn't show logout button

- Make sure `AuthProvider` is wrapping your app in `layout.tsx`
- Check browser console for errors
- Try refreshing the page

### "Firebase app not initialized"

- Restart dev server: `npm run dev`
- Check `.env.local` file exists and has all variables
- Verify all env variables start with `NEXT_PUBLIC_`

---

## 📞 Need Help?

Check these files:

- `FIREBASE_QUICKSTART.md` - Quick reference
- `FIREBASE_IMPLEMENTATION_STATUS.md` - Detailed progress
- `ONLINE_SHOP_SYSTEM_TODO.md` - Complete roadmap

**Everything is set up and ready to go! 🚀**
