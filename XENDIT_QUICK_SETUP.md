# Xendit Payment Integration - Quick Setup Guide

## 🚀 Quick Start

### 1. Environment Variables (Already Added ✅)

The following keys have been added to `.env.local`:

```bash
XENDIT_SECRET_KEY=xnd_development_2YMSpQ8ZF9YD5FNRRmp7OtAm9aJ3DRGZydEXRI8PwnGd6b82EJg5SqKdl8g
NEXT_PUBLIC_XENDIT_PUBLIC_KEY=xnd_public_development_gL1rLRTIv4uaUwCnKdcD4PzSn6NkGgrb8HB09egLbqkPa7HXLEXjzl5zayp4j
XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token_here
XENDIT_CURRENCY=USD
```

**⚠️ Action Required**: Update `XENDIT_WEBHOOK_TOKEN` with your actual token from Xendit dashboard.

### 💱 Currency Configuration

- **Current Currency**: USD (United States Dollar)
- **Your store displays prices in**: $ (Dollar sign)
- **Customers pay in**: USD
- **Supported currencies**: USD, IDR, PHP, VND, THB, SGD, MYR

**Important**: Xendit does NOT auto-convert currencies. If you want to charge in a different currency:

1. Change `XENDIT_CURRENCY` in `.env.local` (e.g., `XENDIT_CURRENCY=IDR`)
2. Update product prices to match that currency
3. Update currency symbols in your UI
4. Restart dev server

### 2. Files Created ✅

- ✅ `app/api/payments/create-invoice/route.ts` - Invoice creation endpoint
- ✅ `app/api/payments/webhook/route.ts` - Webhook handler
- ✅ `.env.local` - Updated with Xendit keys
- ✅ `XENDIT_PAYMENT_INTEGRATION.md` - Full documentation

### 3. Files Modified ✅

- ✅ `app/checkout/page.tsx` - Added payment invoice creation
- ✅ `app/order-confirmation/[orderId]/page.tsx` - Added payment buttons and status
- ✅ `app/account/page.tsx` - Added "Continue Payment" button to orders

## 🧪 Testing Locally

### Step 1: Start Development Server

```powershell
cd 'c:\Users\kevin\SynologyDrive\isy.software\lyluxbelladonna.love\lyluxbelladonna.love'
npm run dev
```

### Step 2: Set Up ngrok for Webhook Testing (Optional)

```powershell
# Install ngrok if not already installed
# Download from: https://ngrok.com/download

# Start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Add webhook in Xendit dashboard: https://abc123.ngrok.io/api/payments/webhook
```

### Step 3: Configure Xendit Webhook

1. Go to [Xendit Dashboard](https://dashboard.xendit.co/)
2. Navigate to **Settings → Webhooks**
3. Click **Add Webhook**
4. Enter webhook URL:
   - Local: `https://your-ngrok-url.ngrok.io/api/payments/webhook`
   - Production: `https://yourdomain.com/api/payments/webhook`
5. Select events:
   - ✅ Invoice paid
   - ✅ Invoice expired
   - ✅ Invoice pending
6. Generate callback token
7. Update `.env.local` with the token:
   ```bash
   XENDIT_WEBHOOK_TOKEN=your_generated_token_here
   ```
8. Restart dev server

### Step 4: Test Payment Flow

1. **Create Test Order**:

   - Login to your account
   - Add items to cart
   - Go to checkout
   - Fill shipping/billing information
   - Click "Place Order"

2. **Verify Invoice Creation**:

   - Check browser console for: `"Payment invoice created: inv_..."`
   - You should be redirected to order confirmation page
   - Payment button should appear if order is pending

3. **Complete Payment**:

   - Click "Continue Payment" button
   - Use Xendit test card:
     - Card: `4000000000000002`
     - Expiry: Any future date (e.g., 12/25)
     - CVV: Any 3 digits (e.g., 123)
   - Complete payment

4. **Verify Webhook**:
   - Check server console for: `"Xendit webhook received:..."`
   - Check server console for: `"Order {orderId} updated: paymentStatus=paid..."`
   - Refresh order confirmation page
   - Payment status should show "paid" with green badge

## 🎯 What Happens Now

### Checkout Flow

```
Customer fills checkout form
         ↓
Order created in Firestore (status: pending, paymentStatus: pending)
         ↓
Xendit invoice created (24-hour expiry)
         ↓
Order updated with payment URL
         ↓
Customer redirected to order confirmation
         ↓
Customer clicks "Continue Payment" → Opens Xendit payment page
         ↓
Customer completes payment
         ↓
Xendit sends webhook to your server
         ↓
Order auto-updated (status: processing, paymentStatus: paid)
         ↓
Customer sees "Payment Completed" message
```

### Order States After Payment

- **Before Payment**:

  - `status: "pending"`
  - `paymentStatus: "pending"`
  - Yellow badge + "Continue Payment" button

- **After Payment**:

  - `status: "processing"`
  - `paymentStatus: "paid"`
  - Green badge + "Payment Completed" message

- **If Expired** (24 hours):
  - `status: "cancelled"`
  - `paymentStatus: "expired"`
  - Red badge

## 📍 Where to Find Payment Buttons

1. **Order Confirmation Page** (`/order-confirmation/[orderId]`):

   - Shows yellow alert box with payment info
   - "Continue Payment" button (opens Xendit page in new tab)
   - Shows payment expiry date
   - Changes to green success message after payment

2. **Account Orders Page** (`/account`):
   - "Continue Payment" button next to each pending order
   - "View Order" button to see full details
   - Payment button only shows for pending payments

## 🔍 Debugging

### Check Logs

1. **Browser Console** (F12):

   - Look for "Payment invoice created:"
   - Check for any error messages

2. **Server Console**:
   - Look for "Xendit webhook received:"
   - Look for "Order updated:"
   - Check for any API errors

### Common Issues

**Problem**: "Payment service not configured"

- **Solution**: Make sure `XENDIT_SECRET_KEY` is in `.env.local`
- Restart dev server after adding

**Problem**: Webhook not received after payment

- **Solution**:
  - Verify ngrok is running
  - Check webhook URL in Xendit dashboard
  - Verify `XENDIT_WEBHOOK_TOKEN` matches dashboard

**Problem**: Order status not updating

- **Solution**:
  - Check server console for webhook logs
  - Verify orderId in webhook matches Firestore document
  - Check Firestore rules allow updates

## 🔐 Security Notes

- ✅ Secret key stored server-side only (`.env.local`)
- ✅ Webhook token verification implemented
- ✅ Never expose secret key to client
- ⚠️ `.env.local` is in `.gitignore` - don't commit secrets

## 📚 Next Steps

1. **Test Payment Flow**: Follow Step 4 above
2. **Configure Webhook**: Set up webhook in Xendit dashboard
3. **Production Setup**: When ready for production:
   - Replace development keys with production keys
   - Update `NEXT_PUBLIC_BASE_URL` in `.env.local`
   - Configure webhook with production domain (HTTPS required)

## 📖 Full Documentation

See `XENDIT_PAYMENT_INTEGRATION.md` for:

- Complete API reference
- Database schema
- Error handling details
- Production checklist
- Customer support procedures
- Advanced features

## ✅ Implementation Status

- [x] Xendit keys added to `.env.local`
- [x] Invoice creation API endpoint
- [x] Webhook handler with auto-update
- [x] Checkout integration
- [x] Order confirmation page UI
- [x] Account orders page UI
- [x] Payment status badges
- [x] Continue Payment buttons
- [x] Documentation

## 🎉 Ready to Test!

Your Xendit integration is complete and ready for testing. Start the dev server and try creating an order!

```powershell
npm run dev
```

---

**Need Help?**

- See `XENDIT_PAYMENT_INTEGRATION.md` for detailed docs
- Check Xendit docs: https://docs.xendit.co/
- Contact Xendit support for API issues
