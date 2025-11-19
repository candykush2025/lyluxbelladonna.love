import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Missing invoiceId parameter" },
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

    // Fetch invoice status from NOWPayments API
    const response = await fetch(
      `https://api.nowpayments.io/v1/invoice/${invoiceId}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("NOWPayments API error:", response.status, errorData);
      return NextResponse.json(
        { error: "Failed to fetch invoice status" },
        { status: response.status }
      );
    }

    const invoiceData = await response.json();

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoiceData.id,
        status: invoiceData.status,
        price_amount: invoiceData.price_amount,
        price_currency: invoiceData.price_currency,
        pay_amount: invoiceData.pay_amount,
        pay_currency: invoiceData.pay_currency,
        order_id: invoiceData.order_id,
        created_at: invoiceData.created_at,
        updated_at: invoiceData.updated_at,
      },
    });
  } catch (error) {
    console.error("Error checking invoice status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
