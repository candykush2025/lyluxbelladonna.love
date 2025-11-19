import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      orderNumber,
      amount,
      email,
      description,
      items,
      customerName,
      currency = "THB", // Default to THB for Thailand
    } = body;

    // Validate required fields
    if (!orderId || !orderNumber || !amount || !email) {
      return NextResponse.json(
        {
          error: "Missing required fields: orderId, orderNumber, amount, email",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.NOWPAYMENT_API_KEY;
    if (!apiKey) {
      console.error("NOWPAYMENT_API_KEY not configured");
      return NextResponse.json(
        { error: "NOWPayments service not configured" },
        { status: 500 }
      );
    }

    // Prepare the invoice payload for NOWPayments
    const invoicePayload = {
      price_amount: amount,
      price_currency: currency,
      pay_currency: "BTC", // Default to BTC, user can choose on NOWPayments page
      order_id: orderId,
      order_description: description || `Order ${orderNumber}`,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/nowpayments/webhook`,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation/${orderId}?payment=crypto`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?payment=cancelled`,
    };

    console.log("Creating NOWPayments invoice:", {
      orderId,
      orderNumber,
      amount,
      currency,
      email,
    });

    // Create invoice via NOWPayments API
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(invoicePayload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("NOWPayments API error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to create payment invoice" },
        { status: 500 }
      );
    }

    const invoiceData = await response.json();
    console.log("NOWPayments invoice created:", {
      id: invoiceData.id,
      invoice_url: invoiceData.invoice_url,
      status: invoiceData.status,
    });

    // Return the invoice data to the frontend
    return NextResponse.json({
      success: true,
      invoice: {
        id: invoiceData.id,
        invoice_url: invoiceData.invoice_url,
        payment_url: invoiceData.invoice_url, // NOWPayments uses invoice_url
        status: invoiceData.status || "pending", // Default to pending if not provided
        price_amount: invoiceData.price_amount,
        price_currency: invoiceData.price_currency,
        pay_amount: invoiceData.pay_amount || invoiceData.price_amount, // Fallback to price_amount
        pay_currency: invoiceData.pay_currency || "BTC", // Default to BTC
        order_id: invoiceData.order_id,
        order_description: invoiceData.order_description,
      },
    });
  } catch (error) {
    console.error("Error creating NOWPayments invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
