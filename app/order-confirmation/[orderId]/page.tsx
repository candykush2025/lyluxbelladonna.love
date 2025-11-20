"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getOrder } from "@/lib/firestore";
import { useCurrency } from "@/lib/currency-context";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  createdAt: any;
  xenditInvoiceUrl?: string;
  xenditInvoiceId?: string;
  xenditExpiryDate?: string;
  xenditCurrency?: string;
  xenditAmount?: number;
  xenditConversionRate?: number;
  // NOWPayments fields
  nowpaymentsInvoiceId?: string;
  nowpaymentsInvoiceUrl?: string;
  nowpaymentsStatus?: string;
  nowpaymentsPriceAmount?: number;
  nowpaymentsPriceCurrency?: string;
  nowpaymentsPayAmount?: number;
  nowpaymentsPayCurrency?: string;
  paymentDetails?: {
    provider: string;
    invoiceId: string;
    payAmount: number;
    payCurrency: string;
    priceAmount: number;
    priceCurrency: string;
    lastUpdated: any;
  };
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentStatusFromUrl, setPaymentStatusFromUrl] = useState<
    string | null
  >(null);

  const { formatPrice } = useCurrency();

  useEffect(() => {
    // Check for payment status in URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentParam = urlParams.get("payment");
      if (paymentParam) {
        setPaymentStatusFromUrl(paymentParam);
      }
    }

    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const orderData = await getOrder(orderId);

        if (orderData) {
          let updatedOrderData = orderData as OrderData;

          // Check payment status if order is pending and has invoice ID
          if (updatedOrderData.paymentStatus === "pending") {
            try {
              if (updatedOrderData.xenditInvoiceId) {
                // Check Xendit payment status
                const response = await fetch("/api/payments/check-status", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderId: orderId,
                    invoiceId: updatedOrderData.xenditInvoiceId,
                  }),
                });

                if (response.ok) {
                  const result = await response.json();
                  console.log("Xendit payment status updated:", result);

                  // Update order data with new status
                  updatedOrderData = {
                    ...updatedOrderData,
                    paymentStatus: result.paymentStatus,
                    status: result.orderStatus,
                  };
                }
              } else if (updatedOrderData.nowpaymentsInvoiceId) {
                // Check NOWPayments invoice status
                const response = await fetch(
                  `/api/payments/nowpayments/status?invoiceId=${updatedOrderData.nowpaymentsInvoiceId}`
                );

                if (response.ok) {
                  const result = await response.json();
                  console.log("NOWPayments status updated:", result);

                  // Map NOWPayments status to our internal status
                  let paymentStatus = "pending";
                  let orderStatus = "pending";

                  switch (result.invoice.status?.toLowerCase()) {
                    case "finished":
                    case "paid":
                      paymentStatus = "paid";
                      orderStatus = "processing";
                      break;
                    case "confirming":
                      paymentStatus = "confirming";
                      orderStatus = "pending";
                      break;
                    case "waiting":
                      paymentStatus = "waiting";
                      orderStatus = "pending";
                      break;
                    case "expired":
                    case "canceled":
                    case "failed":
                      paymentStatus = "failed";
                      orderStatus = "cancelled";
                      break;
                  }

                  // Update order data with new status
                  updatedOrderData = {
                    ...updatedOrderData,
                    paymentStatus,
                    status: orderStatus,
                    nowpaymentsStatus: result.invoice.status,
                    paymentDetails: {
                      provider: "nowpayments",
                      invoiceId: result.invoice.id,
                      payAmount: result.invoice.pay_amount,
                      payCurrency: result.invoice.pay_currency,
                      priceAmount: result.invoice.price_amount,
                      priceCurrency: result.invoice.price_currency,
                      lastUpdated: new Date(),
                    },
                  };
                }
              }
            } catch (err) {
              console.error("Error checking payment status:", err);
            }
          }

          setOrder(updatedOrderData);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);
  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
        <Header />
        <main className="pt-24 pb-16 grow">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading order details...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
        <Header />
        <main className="pt-24 pb-16 grow">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Order Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {error ||
                  "The order you're looking for doesn't exist or has been removed."}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">home</span>
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Header />
      <main className="pt-24 pb-16 grow">
        <div className="max-w-6xl mx-auto px-6">
          {/* Payment Status Notification */}
          {paymentStatusFromUrl === "success" && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                  check_circle
                </span>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    Payment Successful!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your payment has been processed successfully. Your order is
                    now being prepared.
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentStatusFromUrl === "failed" && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                  error
                </span>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-300">
                    Payment Failed
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Your payment could not be processed. Please try again or
                    contact support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">
                check_circle
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Thank you for your purchase
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Order #{order.orderNumber}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-2xl text-gray-400">
                            image
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Billing Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Shipping Address
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {order.shippingAddress.fullName}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="mt-2">
                        <span className="font-medium">Phone:</span>{" "}
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Billing Address
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {order.billingAddress.fullName}
                    </p>
                    <p>{order.billingAddress.address}</p>
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.zipCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                    {order.billingAddress.phone && (
                      <p className="mt-2">
                        <span className="font-medium">Phone:</span>{" "}
                        {order.billingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-200">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Payment Method
                    </p>
                    <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Order Status
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                      {order.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Payment Status
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : order.paymentStatus === "expired"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Payment Action Button - Show if payment is pending */}
                {order.paymentStatus === "pending" &&
                  (order.xenditInvoiceUrl || order.nowpaymentsInvoiceUrl) && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">
                          info
                        </span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            Payment Required
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your order has been created. Please complete the
                            payment to process your order.
                          </p>

                          {/* Xendit Payment Info */}
                          {order.xenditCurrency === "IDR" &&
                            order.xenditAmount && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-medium">
                                  Payment Amount:
                                </span>{" "}
                                Rp {order.xenditAmount.toLocaleString("id-ID")}
                                <span className="text-xs ml-2">
                                  (USD {formatPrice(order.total)} @ Rp{" "}
                                  {order.xenditConversionRate?.toLocaleString(
                                    "id-ID"
                                  )}
                                  /USD)
                                </span>
                              </p>
                            )}
                          {order.xenditExpiryDate && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Payment link expires:{" "}
                              {new Date(
                                order.xenditExpiryDate
                              ).toLocaleString()}
                            </p>
                          )}

                          {/* NOWPayments Payment Info */}
                          {order.nowpaymentsPriceAmount &&
                            order.nowpaymentsPriceCurrency && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-medium">
                                  Payment Amount:
                                </span>{" "}
                                {order.nowpaymentsPriceCurrency}{" "}
                                {order.nowpaymentsPriceAmount.toFixed(2)}
                                {order.nowpaymentsPayAmount &&
                                  order.nowpaymentsPayCurrency && (
                                    <span className="text-xs ml-2 block mt-1">
                                      Crypto Amount:{" "}
                                      {order.nowpaymentsPayAmount}{" "}
                                      {order.nowpaymentsPayCurrency}
                                    </span>
                                  )}
                              </p>
                            )}
                          {order.nowpaymentsStatus && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Payment Status: {order.nowpaymentsStatus}
                            </p>
                          )}
                        </div>
                      </div>
                      <a
                        href={
                          order.xenditInvoiceUrl || order.nowpaymentsInvoiceUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg transition-colors text-center font-medium flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">
                          payment
                        </span>
                        {order.paymentMethod === "crypto"
                          ? "Continue Crypto Payment"
                          : "Continue Payment"}
                      </a>
                    </div>
                  )}

                {/* Payment Success Message */}
                {order.paymentStatus === "paid" && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                        check_circle
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          Payment Completed
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your payment has been received and your order is being
                          processed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-3">
                  <Link
                    href="/account"
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors text-center block"
                  >
                    View Order History
                  </Link>
                  <Link
                    href="/"
                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Order Number
                </h4>
                <p className="text-gray-600 dark:text-gray-400 font-mono">
                  {order.orderNumber}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Order Date
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Email
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.email}
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need help with your order? Contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  contact_support
                </span>
                Contact Support
              </Link>
              <Link
                href="/account"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  account_circle
                </span>
                My Account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
