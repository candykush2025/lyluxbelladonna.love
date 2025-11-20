"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { createOrder, updateOrder } from "@/lib/firestore";
import { updateUserProfile } from "@/lib/auth";
import { useCurrency } from "@/lib/currency-context";

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingAddress extends ShippingAddress {
  sameAsShipping: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    sameAsShipping: true,
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  // Crypto payment states
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState<any[]>([]);
  const [currencyMinimums, setCurrencyMinimums] = useState<{
    [key: string]: any;
  }>({});
  const [loadingCrypto, setLoadingCrypto] = useState(false);
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] =
    useState<any>(null);
  const [bathToUsdRate, setBathToUsdRate] = useState(0.029);

  // Payment processing states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Payment monitoring states
  const [paymentStatusTimer, setPaymentStatusTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [cryptoPaymentData, setCryptoPaymentData] = useState<any>(null);
  useEffect(() => {
    console.log("Checkout useEffect running...");
    console.log("User:", user?.email);
    console.log("UserProfile:", userProfile);
    console.log("UserProfile profile:", userProfile?.profile);

    if (
      user &&
      userProfile?.profile?.addresses &&
      userProfile.profile.addresses.length > 0
    ) {
      console.log("User addresses found:", userProfile.profile.addresses);

      // Try to find shipping address first, then default address, then first address
      let addressToUse = userProfile.profile.addresses.find(
        (addr: any) =>
          addr.type === "Shipping" || addr.label === "Shipping Address"
      );

      if (!addressToUse) {
        addressToUse = userProfile.profile.addresses.find(
          (addr: any) => addr.isDefault
        );
      }

      if (!addressToUse && userProfile.profile.addresses.length > 0) {
        addressToUse = userProfile.profile.addresses[0];
      }

      console.log("Address to use for checkout:", addressToUse);
      console.log("Address phone:", addressToUse?.phone);
      console.log("Profile phone:", userProfile.profile?.phone);

      if (addressToUse) {
        const newAddress = {
          fullName: addressToUse.name || "",
          email: user.email || "",
          phone: addressToUse.phone || userProfile.profile?.phone || "",
          address: addressToUse.street || addressToUse.address || "",
          city: addressToUse.city || "",
          state: addressToUse.state || "",
          zipCode: addressToUse.zipCode || "",
          country: addressToUse.country || "United States",
        };
        console.log("Setting shipping address to:", newAddress);
        setShippingAddress(newAddress);
      }
    } else {
      console.log("No addresses found, checking for profile phone...");
      // If no addresses, try to use profile phone for a basic address
      if (userProfile?.profile?.phone) {
        console.log("Using profile phone:", userProfile.profile.phone);
        setShippingAddress((prev) => ({
          ...prev,
          phone: userProfile!.profile!.phone!,
          email: user?.email || prev.email,
        }));
      } else {
        console.log("No profile phone found either");
      }
    }
  }, [user, userProfile]);

  // Redirect to login if not authenticated
  useEffect(() => {
    // Check if there's a valid JWT in localStorage
    const checkJWT = () => {
      try {
        const storedJWT = localStorage.getItem("auth_jwt");
        if (storedJWT) {
          const payload = JSON.parse(atob(storedJWT));
          if (payload.exp > Date.now()) {
            console.log("Valid JWT found, user should be authenticated");
            return true; // Valid JWT exists
          }
        }
      } catch (error) {
        console.error("Error checking JWT:", error);
      }
      return false;
    };

    // Only redirect if loading is complete AND no user AND no valid JWT
    if (!loading && !user && !checkJWT()) {
      console.log("No authentication found, redirecting to login");
      router.push("/login?redirect=/checkout");
    }
  }, [user, router, loading]);

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (
    field: keyof BillingAddress,
    value: string | boolean
  ) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    // Check if cart is empty
    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return false;
    }

    // Validate shipping address
    if (
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      setError("Please fill in all shipping address fields.");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Validate billing address if not same as shipping
    if (!billingAddress.sameAsShipping) {
      if (
        !billingAddress.fullName ||
        !billingAddress.email ||
        !billingAddress.phone ||
        !billingAddress.address ||
        !billingAddress.city ||
        !billingAddress.state ||
        !billingAddress.zipCode ||
        !billingAddress.country
      ) {
        setError("Please fill in all billing address fields.");
        return false;
      }
      if (!emailRegex.test(billingAddress.email)) {
        setError("Please enter a valid billing email address.");
        return false;
      }
    }

    // Validate payment method selection
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return false;
    }

    return true;
  };

  // Crypto payment functions
  const fetchAvailableCurrencies = async () => {
    try {
      const response = await fetch("/api/crypto/currencies");
      if (!response.ok) throw new Error("Failed to fetch currencies");

      const data = await response.json();
      let currencies =
        data.currencies && Array.isArray(data.currencies)
          ? data.currencies
          : Array.isArray(data)
          ? data
          : [];

      return currencies;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      return [];
    }
  };

  const fetchMinimumAmount = async (currencyFrom: string, totalUsd: number) => {
    try {
      const response = await fetch(
        `/api/crypto/min-amount?currency_from=${currencyFrom}&currency_to=trx&fiat_equivalent=usd&is_fixed_rate=false&is_fee_paid_by_user=false`
      );

      if (!response.ok) throw new Error("Failed to fetch minimum amount");
      const data = await response.json();

      return {
        minAmount: data.min_amount || 0,
        fiatEquivalent: data.fiat_equivalent || 0,
      };
    } catch (error) {
      console.error("Error fetching minimum amount:", error);
      return { minAmount: 0, fiatEquivalent: 0 };
    }
  };

  const loadCryptoData = async () => {
    setLoadingCrypto(true);
    try {
      // Fetch available currencies
      const currencies = await fetchAvailableCurrencies();
      setAvailableCurrencies(currencies);

      // Calculate total: Cart is already in USD (with tax)
      const totalOrderInUsd = total;

      // Fetch minimum amounts for each currency we want to display
      const displayCurrencies = [
        { code: "usdterc20", displayName: "USDT (ERC)" },
        { code: "usdttrc20", displayName: "USDT (TRC)" },
        { code: "btc", displayName: "BTC" },
        { code: "eth", displayName: "ETH" },
        { code: "xrp", displayName: "XRP" },
        { code: "trx", displayName: "TRX" },
        { code: "usdc", displayName: "USDC (ERC)" },
        { code: "sol", displayName: "SOL" },
      ];

      const minimums: any = {};
      for (const displayCurrency of displayCurrencies) {
        try {
          const currencyCode = displayCurrency.code.toLowerCase();

          // Find matching currency from available currencies
          const matchingCurrency = currencies.find((c: any) => {
            const apiCode = (c.code || c.currency || c)
              .toString()
              .toLowerCase();
            return (
              apiCode === currencyCode ||
              apiCode.startsWith(currencyCode) ||
              currencyCode.startsWith(apiCode)
            );
          });

          if (matchingCurrency) {
            const minData = await fetchMinimumAmount(
              currencyCode,
              totalOrderInUsd
            );
            minimums[currencyCode] = minData;
          }
        } catch (error) {
          console.error(
            `Error fetching min for ${displayCurrency.code}:`,
            error
          );
        }
      }

      setCurrencyMinimums(minimums);
    } catch (error) {
      console.error("Error loading crypto data:", error);
    } finally {
      setLoadingCrypto(false);
    }
  };

  const createCryptoPayment = async (selectedCurrency: any) => {
    // Check if user is authenticated
    if (!user) {
      setPaymentError("Please log in to place an order.");
      return;
    }

    setCreatingPayment(true);
    setPaymentError(null);

    try {
      const totalOrderInUsd = total;
      const currencyCode = (
        selectedCurrency.code ||
        selectedCurrency.currency ||
        selectedCurrency
      ).toLowerCase();

      // Create order ID
      const orderId = `CK-${Date.now()}`;

      const paymentRequest = {
        price_amount: totalOrderInUsd,
        price_currency: "usd",
        pay_currency: currencyCode,
        order_id: orderId,
        order_description: `Candy Kush Order - ${cartItems.length} items`,
        ipn_callback_url: `${window.location.origin}/api/crypto/callback`,
        is_fixed_rate: true,
        is_fee_paid_by_user: false,
      };

      const response = await fetch("/api/crypto/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment");
      }

      const paymentData = await response.json();

      // Save payment data for later use in order submission
      setCryptoPaymentData(paymentData);

      // Save payment to Firebase for tracking (but don't create order yet)
      await saveCryptoPaymentToFirebase(paymentData, selectedCurrency);

      setPaymentDetails(paymentData);
      setPaymentStatus(paymentData);

      // Close crypto selection modal and show payment modal
      setShowCryptoModal(false);
      setShowPaymentModal(true);

      // Start monitoring payment status
      startPaymentMonitoring(paymentData.payment_id);
    } catch (error: any) {
      console.error("Error creating payment:", error);
      setPaymentError(error.message);
    } finally {
      setCreatingPayment(false);
    }
  };

  const handleCryptoCancellation = async () => {
    try {
      // Prepare order data for cancelled crypto payment
      const rawOrderData = {
        userId: user?.uid || null,
        email: shippingAddress.email || "",
        items: cartItems.map((item) => ({
          productId: item.productId || "",
          name: item.name || "",
          price: item.price || 0,
          quantity: item.quantity || 0,
          size: item.size || "",
          color: item.color || "",
          image: item.image || "",
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName || "",
          email: shippingAddress.email || "",
          phone: shippingAddress.phone || "",
          address: shippingAddress.address || "",
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          zipCode: shippingAddress.zipCode || "",
          country: shippingAddress.country || "United States",
        },
        billingAddress: billingAddress.sameAsShipping
          ? {
              fullName: shippingAddress.fullName || "",
              email: shippingAddress.email || "",
              phone: shippingAddress.phone || "",
              address: shippingAddress.address || "",
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              zipCode: shippingAddress.zipCode || "",
              country: shippingAddress.country || "United States",
            }
          : {
              fullName: billingAddress.fullName || "",
              email: billingAddress.email || "",
              phone: billingAddress.phone || "",
              address: billingAddress.address || "",
              city: billingAddress.city || "",
              state: billingAddress.state || "",
              zipCode: billingAddress.zipCode || "",
              country: billingAddress.country || "United States",
            },
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        tax: tax || 0,
        total: total || 0,
        paymentMethod: "crypto",
        status: "cancelled",
        paymentStatus: "cancelled",
        cancellationReason: showCryptoModal
          ? "User cancelled crypto payment selection"
          : "User cancelled crypto payment",
        cancelledAt: new Date(),
        // Add crypto payment data if it exists
        ...(cryptoPaymentData && {
          cryptoPaymentData,
          nowpaymentsPaymentId: cryptoPaymentData.payment_id,
        }),
      };

      // Sanitize data to remove any undefined values
      const sanitizeData = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(sanitizeData);

        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined) {
            sanitized[key] = sanitizeData(value);
          }
        }
        return sanitized;
      };

      const orderData = sanitizeData(rawOrderData);

      // Create cancelled order in Firestore
      const orderResult = await createOrder(orderData);
      console.log(
        "Cancelled order created in Firestore:",
        orderResult.id,
        orderResult.orderNumber
      );

      // Clear the cart after creating cancelled order
      clearCart();
      console.log("Cart cleared after crypto payment cancellation");

      // Close modals and reset payment method
      setShowCryptoModal(false);
      setShowPaymentModal(false);
      setPaymentMethod("cash");

      // Clear payment monitoring
      if (paymentStatusTimer) {
        clearInterval(paymentStatusTimer);
        setPaymentStatusTimer(null);
      }

      // Clear payment data
      setCryptoPaymentData(null);
      setPaymentDetails(null);
      setPaymentStatus(null);
    } catch (error) {
      console.error("Error cancelling crypto payment:", error);
      // Still close modals even if order creation fails
      setShowCryptoModal(false);
      setShowPaymentModal(false);
      setPaymentMethod("cash");
    }
  };

  const startPaymentMonitoring = (paymentId: string) => {
    // Clear any existing timer
    if (paymentStatusTimer) {
      clearInterval(paymentStatusTimer);
    }

    // Check status immediately
    checkPaymentStatus(paymentId);

    // Set up periodic checking
    const timer = setInterval(() => {
      checkPaymentStatus(paymentId);
    }, 10000); // Check every 10 seconds

    setPaymentStatusTimer(timer);
  };

  const checkPaymentStatus = async (paymentId: string) => {
    if (checkingStatus) return; // Prevent overlapping requests

    setCheckingStatus(true);
    try {
      const response = await fetch(`/api/crypto/payment/${paymentId}`);
      if (!response.ok) throw new Error("Failed to check payment status");

      const statusData = await response.json();
      setPaymentStatus(statusData);

      // Stop monitoring if payment is final
      if (
        ["finished", "confirmed", "failed", "expired", "refunded"].includes(
          statusData.payment_status
        )
      ) {
        if (paymentStatusTimer) {
          clearInterval(paymentStatusTimer);
          setPaymentStatusTimer(null);
        }

        // If payment successful, proceed with order
        if (statusData.payment_status === "finished") {
          await submitOrderToPOS();
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const saveCryptoPaymentToFirebase = async (
    paymentData: any,
    selectedCurrency: any
  ) => {
    try {
      const { collection, addDoc } = await import("firebase/firestore");
      const { db } = await import("../../lib/firebase");

      const cryptoPaymentData = {
        payment_id: paymentData.payment_id,
        order_id: paymentData.order_id,
        payment_status: paymentData.payment_status,
        pay_address: paymentData.pay_address,
        price_amount: paymentData.price_amount,
        price_currency: paymentData.price_currency,
        pay_amount: paymentData.pay_amount,
        pay_currency: paymentData.pay_currency,
        customer_id: user?.uid || null,
        customer_name: user ? `${user.displayName || user.email}` : "",
        cart_items: cartItems,
        total_bath: total,
        total_usd: total,
        selected_currency: selectedCurrency,
        created_at: new Date(),
        updated_at: new Date(),
        expiration_date: paymentData.expiration_estimate_date
          ? new Date(paymentData.expiration_estimate_date)
          : null,
      };

      const docRef = await addDoc(
        collection(db, "crypto_payments"),
        cryptoPaymentData
      );
      console.log("Crypto payment saved to Firebase:", docRef.id);
    } catch (error) {
      console.error("Error saving crypto payment to Firebase:", error);
    }
  };

  const submitOrderToPOS = async () => {
    try {
      const orderData = {
        userId: user?.uid || null,
        email: shippingAddress.email || "",
        items: cartItems.map((item) => ({
          productId: item.productId || "",
          name: item.name || "",
          price: item.price || 0,
          quantity: item.quantity || 0,
          size: item.size || "",
          color: item.color || "",
          image: item.image || "",
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName || "",
          email: shippingAddress.email || "",
          phone: shippingAddress.phone || "",
          address: shippingAddress.address || "",
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          zipCode: shippingAddress.zipCode || "",
          country: shippingAddress.country || "United States",
        },
        billingAddress: billingAddress.sameAsShipping
          ? {
              fullName: shippingAddress.fullName || "",
              email: shippingAddress.email || "",
              phone: shippingAddress.phone || "",
              address: shippingAddress.address || "",
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              zipCode: shippingAddress.zipCode || "",
              country: shippingAddress.country || "United States",
            }
          : {
              fullName: billingAddress.fullName || "",
              email: billingAddress.email || "",
              phone: billingAddress.phone || "",
              address: billingAddress.address || "",
              city: billingAddress.city || "",
              state: billingAddress.state || "",
              zipCode: billingAddress.zipCode || "",
              country: billingAddress.country || "United States",
            },
        subtotal: getCartTotal() * 0.87, // Approximate subtotal
        shipping: 0,
        tax: getCartTotal() * 0.13, // Approximate tax
        total: getCartTotal(),
        paymentMethod: "crypto",
        status: "completed",
        paymentStatus: "paid",
        cryptoPaymentData: cryptoPaymentData,
        nowpaymentsPaymentId: cryptoPaymentData?.payment_id,
        nowpaymentsStatus: "finished",
      };

      const orderResult = await createOrder(orderData);

      // Save shipping address to user profile
      if (user) {
        try {
          const currentAddresses = userProfile?.profile?.addresses || [];
          const shippingAddressData = {
            id: `shipping-${Date.now()}`,
            label: "Shipping Address",
            name: shippingAddress.fullName || "",
            street: shippingAddress.address || "",
            city: shippingAddress.city || "",
            state: shippingAddress.state || "",
            zipCode: shippingAddress.zipCode || "",
            country: shippingAddress.country || "United States",
            phone: shippingAddress.phone || "",
            isDefault: currentAddresses.length === 0,
          };

          const updatedAddresses = [...currentAddresses, shippingAddressData];

          await updateUserProfile(
            user.uid,
            user.displayName || user.email || "",
            {
              phone: shippingAddress.phone,
              addresses: updatedAddresses,
            }
          );
        } catch (addressError) {
          console.error("Error saving shipping address:", addressError);
        }
      }

      // Clear cart after successful order
      await clearCart();

      // Redirect to order confirmation
      router.push(`/order-confirmation/${orderResult.id}`);
    } catch (error) {
      console.error("Error submitting order to POS:", error);
      setError("Failed to complete order. Please contact support.");
    }
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated for non-crypto payments
    if (!user) {
      setError("Please log in to place an order.");
      return;
    }

    // Handle crypto payment differently - show currency selection modal
    if (paymentMethod === "crypto") {
      setLoading(true);
      try {
        await loadCryptoData();
        setShowCryptoModal(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    try {
      // Helper function to remove undefined values
      const sanitizeData = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(sanitizeData);

        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined) {
            sanitized[key] = sanitizeData(value);
          }
        }
        return sanitized;
      };

      // Prepare order data
      const rawOrderData = {
        userId: user?.uid || null,
        email: shippingAddress.email || "",
        items: cartItems.map((item) => ({
          productId: item.productId || "",
          name: item.name || "",
          price: item.price || 0,
          quantity: item.quantity || 0,
          size: item.size || "",
          color: item.color || "",
          image: item.image || "",
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName || "",
          email: shippingAddress.email || "",
          phone: shippingAddress.phone || "",
          address: shippingAddress.address || "",
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          zipCode: shippingAddress.zipCode || "",
          country: shippingAddress.country || "United States",
        },
        billingAddress: billingAddress.sameAsShipping
          ? {
              fullName: shippingAddress.fullName || "",
              email: shippingAddress.email || "",
              phone: shippingAddress.phone || "",
              address: shippingAddress.address || "",
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              zipCode: shippingAddress.zipCode || "",
              country: shippingAddress.country || "United States",
            }
          : {
              fullName: billingAddress.fullName || "",
              email: billingAddress.email || "",
              phone: billingAddress.phone || "",
              address: billingAddress.address || "",
              city: billingAddress.city || "",
              state: billingAddress.state || "",
              zipCode: billingAddress.zipCode || "",
              country: billingAddress.country || "United States",
            },
        subtotal: subtotal || 0,
        shipping: shipping || 0,
        tax: tax || 0,
        total: total || 0,
        paymentMethod: paymentMethod || "card",
        status: "pending",
        paymentStatus: "pending",
      };

      // Sanitize data to remove any undefined values
      const orderData = sanitizeData(rawOrderData);

      // CREATE PAYMENT INVOICE FIRST (before creating order in database)
      let paymentData;
      let paymentEndpoint;

      if (paymentMethod === "crypto") {
        // Use NOWPayments for cryptocurrency
        paymentEndpoint = "/api/payments/nowpayments/create-invoice";
      } else {
        // Use Xendit for other payment methods
        paymentEndpoint = "/api/payments/create-invoice";
      }

      const paymentResponse = await fetch(paymentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: "temp-" + Date.now(), // Temporary ID for payment creation
          orderNumber: "TEMP-" + Date.now(),
          amount: total,
          email: shippingAddress.email,
          customerName: shippingAddress.fullName,
          description: `Payment for Order`,
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Failed to create payment invoice");
      }

      paymentData = await paymentResponse.json();

      // NOW CREATE ORDER IN DATABASE ONLY AFTER PAYMENT INVOICE SUCCESS
      let orderDataWithPayment = { ...orderData };

      // Add payment information to order data
      if (paymentMethod === "crypto") {
        orderDataWithPayment = {
          ...orderDataWithPayment,
          nowpaymentsInvoiceId: paymentData.invoice.id,
          nowpaymentsInvoiceUrl: paymentData.invoice.invoice_url,
          nowpaymentsStatus: paymentData.invoice.status,
          nowpaymentsPriceAmount: paymentData.invoice.price_amount,
          nowpaymentsPriceCurrency: paymentData.invoice.price_currency,
          nowpaymentsPayAmount: paymentData.invoice.pay_amount,
          nowpaymentsPayCurrency: paymentData.invoice.pay_currency,
        };

        console.log(
          "NOWPayments invoice created:",
          paymentData.invoice.id,
          `(${paymentData.invoice.price_currency} ${paymentData.invoice.price_amount})`
        );
      } else {
        orderDataWithPayment = {
          ...orderDataWithPayment,
          xenditInvoiceId: paymentData.invoiceId,
          xenditInvoiceUrl: paymentData.invoiceUrl,
          xenditExpiryDate: paymentData.expiryDate,
          xenditCurrency: paymentData.currency,
          xenditAmount: paymentData.amount,
          xenditConversionRate: paymentData.conversionRate,
        };

        console.log(
          "Xendit invoice created:",
          paymentData.invoiceId,
          `(${paymentData.currency} ${paymentData.amount})`
        );
      }

      // Create order in Firestore with payment information included
      const orderResult = await createOrder(orderDataWithPayment);

      // Save shipping address to user profile
      if (user) {
        try {
          const currentAddresses = userProfile?.profile?.addresses || [];
          const rawShippingAddressData = {
            id: `shipping-${Date.now()}`,
            label: "Shipping Address",
            name: shippingAddress.fullName || "",
            street: shippingAddress.address || "",
            city: shippingAddress.city || "",
            state: shippingAddress.state || "",
            zipCode: shippingAddress.zipCode || "",
            country: shippingAddress.country || "United States",
            phone: shippingAddress.phone || "",
            isDefault: currentAddresses.length === 0, // Make default if no addresses exist
          };

          const shippingAddressData = sanitizeData(rawShippingAddressData);
          const updatedAddresses = [...currentAddresses, shippingAddressData];

          await updateUserProfile(
            user.uid,
            user.displayName || user.email || "",
            {
              phone: shippingAddress.phone,
              addresses: updatedAddresses,
            }
          );
        } catch (addressError) {
          console.error("Error saving shipping address:", addressError);
          // Don't fail the order if address saving fails
        }
      }

      // Clear cart after successful order
      await clearCart();

      // Redirect to payment page immediately
      const paymentUrl =
        paymentMethod === "crypto"
          ? paymentData.invoice?.invoice_url || paymentData.invoice?.payment_url
          : paymentData.invoiceUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        // Fallback to order confirmation if no payment URL
        router.push(`/order-confirmation/${orderResult.id}`);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to create payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
          <div className="max-w-6xl mx-auto text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-gray-400">Checking authentication...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
          <div className="max-w-6xl mx-auto text-center py-16">
            <h1 className="text-white text-4xl font-black font-serif mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-400 mb-6">
              Add some items to your cart before checking out.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary text-background-dark font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-opacity"
            >
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-5xl font-black font-serif mb-12">
            Checkout
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-white text-2xl font-bold mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        handleShippingChange("fullName", e.target.value)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) =>
                          handleShippingChange("email", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          handleShippingChange("phone", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        handleShippingChange("address", e.target.value)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      placeholder="123 Main St, Apt 4B"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          handleShippingChange("city", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          handleShippingChange("state", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          handleShippingChange("zipCode", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleShippingChange("country", e.target.value)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-white text-2xl font-bold mb-6">
                  Billing Address
                </h2>
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={billingAddress.sameAsShipping}
                      onChange={(e) =>
                        handleBillingChange("sameAsShipping", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                    />
                    <span>Same as shipping address</span>
                  </label>
                </div>
                {!billingAddress.sameAsShipping && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.fullName}
                        onChange={(e) =>
                          handleBillingChange("fullName", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={billingAddress.email}
                          onChange={(e) =>
                            handleBillingChange("email", e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) =>
                            handleBillingChange("phone", e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.address}
                        onChange={(e) =>
                          handleBillingChange("address", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="123 Main St, Apt 4B"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) =>
                            handleBillingChange("city", e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.state}
                          onChange={(e) =>
                            handleBillingChange("state", e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="NY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.zipCode}
                          onChange={(e) =>
                            handleBillingChange("zipCode", e.target.value)
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.country}
                        onChange={(e) =>
                          handleBillingChange("country", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-white text-2xl font-bold mb-6">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-white font-medium">
                      Credit/Debit Card
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-white font-medium">PayPal</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-white font-medium">
                      Bank Transfer
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="crypto"
                      checked={paymentMethod === "crypto"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-white font-medium">
                      Cryptocurrency
                    </span>
                  </label>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  * Payment integration coming soon. Orders will be processed
                  manually.
                </p>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-lg p-6 sticky top-24">
                <h2 className="text-white text-2xl font-bold mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item, index) => {
                    // Generate unique key including variants
                    const variantKey =
                      item.variants && Array.isArray(item.variants)
                        ? item.variants
                            .map((v) => `${v.name}-${v.option}`)
                            .join("-")
                        : "";
                    const itemKey = `${item.productId}-${item.size || ""}-${
                      item.color || ""
                    }-${variantKey || index}`;

                    return (
                      <div key={itemKey} className="flex gap-3">
                        <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name || "Product"}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-sm font-medium truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " | "}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-primary text-sm font-semibold mt-1">
                            {formatPrice((item.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-4 mb-6 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-primary text-background-dark font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-opacity mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
                <Link
                  href="/cart"
                  className="block text-center text-primary hover:text-primary/80 text-sm"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Crypto Payment Modal */}
      {showCryptoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 m-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Select Cryptocurrency
              </h3>
              <button
                onClick={handleCryptoCancellation}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {loadingCrypto ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <div className="text-lg text-white/70">
                  Loading available cryptocurrencies...
                </div>
              </div>
            ) : (
              <div>
                {/* Order Summary */}
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">
                      Order Total:
                    </span>
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(total)}
                    </div>
                  </div>
                </div>

                {/* Currency Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { code: "usdterc20", displayName: "USDT (ERC)" },
                    { code: "usdttrc20", displayName: "USDT (TRC)" },
                    { code: "btc", displayName: "BTC" },
                    { code: "eth", displayName: "ETH" },
                    { code: "xrp", displayName: "XRP" },
                    { code: "trx", displayName: "TRX" },
                    { code: "usdc", displayName: "USDC (ERC)" },
                    { code: "sol", displayName: "SOL" },
                  ].map((item) => {
                    const currencyCode = item.code.toLowerCase();
                    const minimum = currencyMinimums[currencyCode];
                    const totalOrderInUsd = total;

                    // Use the currency code as the currency object for now
                    const currency = currencyCode;

                    const meetsMinimum = minimum
                      ? totalOrderInUsd >= minimum.fiatEquivalent
                      : false;
                    const isDisabled = !meetsMinimum;

                    return (
                      <button
                        key={item.code}
                        onClick={() => {
                          if (!isDisabled && currency) {
                            setSelectedCryptoCurrency(currency);
                            createCryptoPayment(currency);
                          }
                        }}
                        disabled={isDisabled}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isDisabled
                            ? "border-white/20 bg-white/5 opacity-50 cursor-not-allowed"
                            : "border-white/20 bg-white/5 hover:border-primary hover:bg-white/10 cursor-pointer"
                        }`}
                      >
                        <div className="text-center">
                          {/* Currency Logo */}
                          <div className="w-12 h-12 mx-auto mb-2 relative">
                            <img
                              src={`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${currencyCode}.svg`}
                              alt={item.displayName}
                              className="w-full h-full object-contain"
                              onError={(e: any) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
                              style={{ display: "none" }}
                            >
                              {currencyCode.charAt(0).toUpperCase()}
                            </div>
                          </div>

                          <div className="font-semibold text-lg text-white">
                            {item.displayName}
                          </div>

                          {isDisabled ? (
                            <div className="mt-2">
                              <div className="text-xs text-red-400 font-semibold">
                                Below Minimum
                              </div>
                              {minimum && (
                                <div className="text-xs text-white/50 mt-1">
                                  Min: $
                                  {minimum.fiatEquivalent?.toFixed(2) || "N/A"}
                                </div>
                              )}
                              {!minimum && (
                                <div className="text-xs text-white/50 mt-1">
                                  Checking availability...
                                </div>
                              )}
                            </div>
                          ) : (
                            minimum && (
                              <div className="text-xs text-green-400 mt-2">
                                Min: $
                                {minimum.fiatEquivalent?.toFixed(2) || "N/A"}
                              </div>
                            )
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && paymentDetails && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Complete Your Payment
              </h3>
              <div className="text-lg text-green-400 font-semibold">
                {(
                  selectedCryptoCurrency?.code ||
                  selectedCryptoCurrency?.currency ||
                  ""
                ).toUpperCase()}{" "}
                Payment
              </div>
            </div>

            {/* Payment Status */}
            <div
              className={`rounded-lg p-4 mb-6 border ${
                paymentStatus?.payment_status === "finished"
                  ? "bg-green-500/10 border-green-500/20"
                  : paymentStatus?.payment_status === "failed"
                  ? "bg-red-500/10 border-red-500/20"
                  : paymentStatus?.payment_status === "confirming"
                  ? "bg-blue-500/10 border-blue-500/20"
                  : "bg-yellow-500/10 border-yellow-500/20"
              }`}
            >
              <div className="flex items-center justify-center">
                <div
                  className={`text-2xl mr-3 ${
                    paymentStatus?.payment_status === "finished"
                      ? "text-green-400"
                      : paymentStatus?.payment_status === "failed"
                      ? "text-red-400"
                      : paymentStatus?.payment_status === "confirming"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }`}
                >
                  {paymentStatus?.payment_status === "finished"
                    ? "✅"
                    : paymentStatus?.payment_status === "failed"
                    ? "❌"
                    : paymentStatus?.payment_status === "confirming"
                    ? "🔄"
                    : "⏳"}
                </div>
                <div>
                  <div
                    className={`font-semibold ${
                      paymentStatus?.payment_status === "finished"
                        ? "text-green-400"
                        : paymentStatus?.payment_status === "failed"
                        ? "text-red-400"
                        : paymentStatus?.payment_status === "confirming"
                        ? "text-blue-400"
                        : "text-yellow-400"
                    }`}
                  >
                    Payment Status:{" "}
                    {paymentStatus?.payment_status ||
                      paymentDetails.payment_status}
                  </div>
                  <div
                    className={`text-sm ${
                      paymentStatus?.payment_status === "finished"
                        ? "text-green-300"
                        : paymentStatus?.payment_status === "failed"
                        ? "text-red-300"
                        : paymentStatus?.payment_status === "confirming"
                        ? "text-blue-300"
                        : "text-yellow-300"
                    }`}
                  >
                    {paymentStatus?.payment_status === "finished"
                      ? "Payment completed successfully!"
                      : paymentStatus?.payment_status === "confirming"
                      ? "Transaction being processed..."
                      : paymentStatus?.payment_status === "failed"
                      ? "Payment failed. Please try again."
                      : "Waiting for your payment..."}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-white mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Order ID:</span>
                  <span className="font-mono text-sm text-white">
                    {paymentDetails.order_id}
                  </span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Total Amount:</span>
                  <span className="font-semibold text-white">
                    ${paymentDetails.price_amount}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-white/10 pt-2 text-white">
                  <span>Pay Amount:</span>
                  <span className="text-green-400">
                    {paymentDetails.pay_amount}{" "}
                    {paymentDetails.pay_currency.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code and Payment Address */}
            <div className="text-center mb-6">
              <div className="bg-white/10 p-4 rounded-lg border border-white/20 inline-block mb-4">
                <div className="w-48 h-48 mx-auto bg-white/5 flex items-center justify-center rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentDetails.pay_address}`}
                    alt="Payment QR Code"
                    className="w-full h-full object-contain"
                    onError={(e: any) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-full h-full flex items-center justify-center text-white/50 text-sm"
                    style={{ display: "none" }}
                  >
                    QR Code unavailable
                  </div>
                </div>
              </div>

              <div className="text-sm text-white/70 mb-2">Payment Address:</div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/20">
                <div className="font-mono text-sm break-all text-white">
                  {paymentDetails.pay_address}
                </div>
              </div>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(paymentDetails.pay_address)
                }
                className="mt-2 px-4 py-2 bg-primary text-background-dark rounded hover:bg-primary/80 text-sm"
              >
                Copy Address
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCryptoCancellation}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20"
              >
                Cancel Payment
              </button>
              {paymentStatus?.payment_status === "finished" && (
                <button
                  onClick={async () => {
                    await submitOrderToPOS();
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Complete Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
