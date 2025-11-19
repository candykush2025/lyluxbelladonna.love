# Xendit Payment Integration Documentation

## Overview

This document describes the complete Xendit payment integration for the LyLux Belladonna e-commerce platform. The integration includes invoice creation, webhook handling for automatic order status updates, and a user-friendly payment flow.

## Configuration

### Environment Variables

Add the following to `.env.local`:

```bash
# Xendit Configuration
XENDIT_SECRET_KEY=xnd_development_2YMSpQ8ZF9YD5FNRRmp7OtAm9aJ3DRGZydEXRI8PwnGd6b82EJg5SqKdl8g
NEXT_PUBLIC_XENDIT_PUBLIC_KEY=xnd_public_development_gL1rLRTIv4uaUwCnKdcD4PzSn6NkGgrb8HB09egLbqkPa7HXLEXjzl5zayp4j
XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token_here
XENDIT_CURRENCY=USD
```

**Important**:

- `XENDIT_SECRET_KEY` is server-side only (no NEXT_PUBLIC prefix)
- `NEXT_PUBLIC_XENDIT_PUBLIC_KEY` is safe for client-side use
- Update `XENDIT_WEBHOOK_TOKEN` with your actual webhook verification token from Xendit dashboard
- `XENDIT_CURRENCY` sets the payment currency (supported: USD, IDR, PHP, VND, THB, SGD, MYR)

## Currency Configuration

### Supported Currencies

Xendit supports the following currencies:

- **USD** - US Dollar (default in this implementation)
- **IDR** - Indonesian Rupiah
- **PHP** - Philippine Peso
- **VND** - Vietnamese Dong
- **THB** - Thai Baht
- **SGD** - Singapore Dollar
- **MYR** - Malaysian Ringgit

### How It Works

1. Your store displays prices in **USD** ($ symbol)
2. The currency is explicitly passed to Xendit as `USD`
3. **Xendit does NOT auto-convert currencies** - the customer pays in USD
4. If you want to accept payments in local currency (e.g., IDR), you need to:
   - Convert prices in your application before creating the invoice
   - Set `XENDIT_CURRENCY=IDR` in `.env.local`
   - Display prices in the target currency on your site

### Changing Currency

To change the payment currency:

1. Update `.env.local`:
   ```bash
   XENDIT_CURRENCY=IDR  # or PHP, VND, THB, SGD, MYR
   ```
2. Update your product prices to match the new currency
3. Update currency symbols in your UI components
4. Restart your development server

**Note**: Xendit does not perform automatic currency conversion. The amount you send is the amount charged in the specified currency.

## Architecture

### 1. Payment Invoice Creation (`/api/payments/create-invoice`)

**Location**: `app/api/payments/create-invoice/route.ts`

**Purpose**: Creates a Xendit invoice for an order

**Request Body**:

```typescript
{
  orderId: string;        // Firestore order document ID
  orderNumber: string;    // Human-readable order number
  amount: number;         // Total order amount
  email: string;          // Customer email
  customerName?: string;  // Customer name
  description?: string;   // Payment description
  items?: Array<{        // Order items
    name: string;
    quantity: number;
    price: number;
  }>;
}
```

**Response**:

```typescript
{
  success: true;
  invoiceId: string; // Xendit invoice ID
  invoiceUrl: string; // Payment page URL
  expiryDate: string; // Invoice expiry timestamp
  status: string; // Invoice status
}
```

**Features**:

- Creates invoice with 24-hour expiry
- Sends email notifications to customer
- Sets success/failure redirect URLs
- Securely authenticates with Xendit using Basic Auth

### 2. Webhook Handler (`/api/payments/webhook`)

**Location**: `app/api/payments/webhook/route.ts`

**Purpose**: Receives payment status updates from Xendit and updates order status

**Webhook Events Handled**:

- `paid` / `settled` → Update order to "paid" and "processing"
- `expired` → Update order to "expired" and "cancelled"
- `pending` → Keep order as "pending"

**Security**:

- Verifies `x-callback-token` header matches `XENDIT_WEBHOOK_TOKEN`
- Returns 401 if token is invalid

**Order Updates**:
When payment is completed, the following fields are updated:

```typescript
{
  paymentStatus: "paid",
  status: "processing",
  xenditInvoiceId: string,
  xenditStatus: string,
  paidAmount: number,
  paymentCompletedAt: string,
  updatedAt: string
}
```

### 3. Checkout Flow

**Location**: `app/checkout/page.tsx`

**Process**:

1. User fills shipping/billing information
2. Order is created in Firestore with `status: "pending"` and `paymentStatus: "pending"`
3. Payment invoice is created via `/api/payments/create-invoice`
4. Order is updated with payment URL and invoice details
5. User is redirected to order confirmation page

**Error Handling**:

- If payment invoice creation fails, order is still created
- User can access payment link from order history later
- Error message informs user they can pay later

### 4. Order Confirmation Page

**Location**: `app/order-confirmation/[orderId]/page.tsx`

**Features**:

- Shows order details, items, and addresses
- Displays payment status badge (color-coded):
  - **Paid**: Green badge
  - **Pending**: Yellow badge with payment button
  - **Expired**: Red badge
- "Continue Payment" button for pending orders
- Payment success message for completed payments
- Payment link expiry date display

**Payment Button**:

- Only shown when `paymentStatus === "pending"` and `xenditInvoiceUrl` exists
- Opens Xendit payment page in new tab
- Shows yellow alert box with payment instructions

### 5. Account Orders Page

**Location**: `app/account/page.tsx`

**Features**:

- Lists all user orders
- Shows "Continue Payment" button for pending orders
- "View Order" button to see full order details
- Payment button only appears for orders with pending payment

## Xendit Webhook Setup

### 1. Configure Webhook in Xendit Dashboard

1. Go to Xendit Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events to listen to:
   - Invoice paid
   - Invoice expired
   - Invoice pending
4. Generate and save callback token
5. Update `XENDIT_WEBHOOK_TOKEN` in `.env.local`

### 2. Test Webhook Locally

For local development, use ngrok or similar tool:

```bash
# Start ngrok
ngrok http 3000

# Use the ngrok URL in Xendit dashboard
https://abc123.ngrok.io/api/payments/webhook
```

## Order States

### Order Status Flow

```
pending → processing → shipped → delivered
        ↓
    cancelled (if payment expires)
```

### Payment Status Flow

```
pending → paid
        ↓
      expired
```

## Database Schema Updates

### Order Document Fields

The following fields are added to order documents:

```typescript
{
  // Existing fields...

  // Xendit payment fields
  xenditInvoiceId?: string;        // Xendit invoice ID
  xenditInvoiceUrl?: string;       // Payment page URL
  xenditExpiryDate?: string;       // Invoice expiry timestamp
  xenditStatus?: string;           // Current Xendit status
  paidAmount?: number;             // Amount paid
  paymentCompletedAt?: string;     // Payment completion timestamp
}
```

## Testing

### Test Payment Flow

1. **Create an Order**:

   - Add items to cart
   - Go to checkout
   - Fill in shipping/billing details
   - Click "Place Order"

2. **Verify Invoice Creation**:

   - Check browser console for payment invoice logs
   - Verify order has `xenditInvoiceUrl` field

3. **Test Payment**:

   - Click "Continue Payment" button
   - Use Xendit test cards (see Xendit docs)
   - Complete payment

4. **Verify Webhook**:
   - Check server logs for webhook received
   - Verify order status updated to "paid" and "processing"
   - Check Firestore for updated fields

### Test Cards (Development Mode)

- **Success**: 4000000000000002
- **Failure**: 4000000000000010
- Use any future expiry date and any CVV

## Error Handling

### Payment Invoice Creation Fails

- Order is still created successfully
- User receives error message but can continue
- Payment button available in order history
- User can retry payment later

### Webhook Processing Fails

- Returns 200 status to prevent Xendit retry
- Logs error for debugging
- Order remains in current state
- Manual intervention may be required

### Invoice Expired

- Webhook updates order to "expired" and "cancelled"
- User can no longer pay this invoice
- Need to create new order if customer wants to retry

## Security Considerations

1. **Secret Key Storage**:

   - Never expose `XENDIT_SECRET_KEY` to client
   - Only used in server-side API routes
   - Store in `.env.local` (not committed to git)

2. **Webhook Verification**:

   - Always verify `x-callback-token` header
   - Reject requests without valid token
   - Use environment variable for token

3. **HTTPS Required**:

   - Xendit requires HTTPS for production webhooks
   - Use SSL certificate for production domain

4. **Input Validation**:
   - Validate all webhook data before processing
   - Sanitize inputs to prevent injection
   - Check order exists before updating

## Production Checklist

- [ ] Replace development keys with production keys
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Configure webhook URL with production domain
- [ ] Enable HTTPS on production server
- [ ] Test webhook with real transactions
- [ ] Set up monitoring for failed payments
- [ ] Configure email notifications
- [ ] Test payment flow end-to-end
- [ ] Document customer support procedures
- [ ] Set up invoice expiry notifications

## Monitoring and Logging

### Important Logs to Monitor

1. **Invoice Creation**: `console.log("Payment invoice created:", invoiceId)`
2. **Webhook Received**: `console.log("Xendit webhook received:", data)`
3. **Order Updated**: `console.log("Order updated: paymentStatus=..., orderStatus=...")`
4. **Errors**: All errors logged with `console.error(...)`

### Metrics to Track

- Invoice creation success rate
- Payment completion rate
- Invoice expiry rate
- Webhook processing time
- Failed payment attempts

## Customer Support

### Common Issues

**1. Customer didn't complete payment**

- Guide user to order history in account page
- Click "Continue Payment" button
- Complete payment before expiry (24 hours)

**2. Payment completed but order still pending**

- Check webhook logs for processing errors
- Manually verify payment in Xendit dashboard
- Update order status manually if needed

**3. Invoice expired**

- Customer needs to create new order
- Previous order will be marked as cancelled
- No refund needed (payment never completed)

## API Reference

### Create Invoice Endpoint

```
POST /api/payments/create-invoice
Content-Type: application/json

Body: {
  orderId: string,
  orderNumber: string,
  amount: number,
  email: string,
  customerName?: string,
  description?: string,
  items?: ItemArray
}

Response: {
  success: boolean,
  invoiceId: string,
  invoiceUrl: string,
  expiryDate: string,
  status: string
}
```

### Webhook Endpoint

```
POST /api/payments/webhook
Content-Type: application/json
x-callback-token: <token>

Body: Xendit webhook payload

Response: {
  success: boolean,
  orderId: string,
  paymentStatus: string,
  orderStatus: string
}
```

## Future Enhancements

1. **Retry Failed Payments**: Allow customers to retry expired invoices
2. **Partial Payments**: Support split/installment payments
3. **Multi-Currency**: Support multiple currencies
4. **Refunds**: Implement refund workflow
5. **Payment Reminders**: Send email reminders before expiry
6. **Admin Dashboard**: Add payment analytics and reports
7. **Mobile App**: Implement in-app payment flow
8. **Subscription Payments**: Support recurring payments

## Support and Resources

- **Xendit Documentation**: https://docs.xendit.co/
- **Xendit Dashboard**: https://dashboard.xendit.co/
- **Xendit API Reference**: https://developers.xendit.co/api-reference/
- **Test Environment**: Use development keys for testing
- **Support**: Contact Xendit support for API issues

---

**Last Updated**: November 19, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
