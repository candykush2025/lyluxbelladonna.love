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
    } = body;

    // Validate required fields
    if (!orderId || !orderNumber || !amount || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
      console.error("XENDIT_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Clean external_id to ensure it only contains valid characters
    const cleanExternalId = orderId.replace(/[^a-zA-Z0-9_-]/g, "_");

    // Convert USD to IDR if needed (Xendit test environment requires IDR)
    const targetCurrency = process.env.XENDIT_CURRENCY || "IDR";
    let finalAmount = amount;

    if (targetCurrency === "IDR") {
      // Convert USD to IDR
      const conversionRate = parseFloat(
        process.env.XENDIT_USD_TO_IDR_RATE || "16800"
      );
      finalAmount = amount * conversionRate;
      console.log(
        `Converting USD ${amount} to IDR ${finalAmount} (rate: ${conversionRate})`
      );
    }

    // Use Xendit Invoice API v2 (simpler than payment requests)
    console.log("Creating Xendit invoice with v2 API...");

    const invoiceRequestBody = {
      external_id: cleanExternalId,
      amount: Math.round(finalAmount), // IDR doesn't use decimals
      payer_email: email,
      description: description || `Payment for Order #${orderNumber}`,
      invoice_duration: 86400, // 24 hours
      currency: targetCurrency,
      success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation/${orderId}?payment=success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation/${orderId}?payment=failed`,
    };

    console.log("Invoice v2 Request body:", invoiceRequestBody);

    const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString(
          "base64"
        )}`,
      },
      body: JSON.stringify(invoiceRequestBody),
    });

    if (!xenditResponse.ok) {
      const errorData = await xenditResponse.json();
      console.error("Xendit API error:", {
        status: xenditResponse.status,
        statusText: xenditResponse.statusText,
        error: errorData,
        requestBody: {
          external_id: orderId,
          amount: Math.round(amount * 100) / 100,
          currency: process.env.XENDIT_CURRENCY || "USD",
          payer_email: email,
          description: description || `Payment for Order #${orderNumber}`,
        },
      });
      return NextResponse.json(
        {
          error: "Failed to create payment invoice",
          details: errorData.message || errorData.error || "Unknown error",
          xenditStatus: xenditResponse.status,
        },
        { status: xenditResponse.status }
      );
    }

    const invoiceData = await xenditResponse.json();

    console.log("Xendit Invoice v2 response:", {
      status: xenditResponse.status,
      id: invoiceData.id,
      invoice_url: invoiceData.invoice_url,
      status_invoice: invoiceData.status,
    });

    return NextResponse.json({
      success: true,
      invoiceId: invoiceData.id,
      invoiceUrl: invoiceData.invoice_url,
      expiryDate: invoiceData.expiry_date,
      status: invoiceData.status,
      currency: targetCurrency,
      amount: finalAmount,
      originalAmount: amount,
      conversionRate:
        targetCurrency === "IDR"
          ? parseFloat(process.env.XENDIT_USD_TO_IDR_RATE || "16800")
          : 1,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
