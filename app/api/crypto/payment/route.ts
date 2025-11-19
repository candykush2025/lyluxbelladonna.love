import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      price_amount,
      price_currency,
      pay_currency,
      order_id,
      order_description,
      ipn_callback_url,
    } = body;

    if (!price_amount || !price_currency || !pay_currency) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: price_amount, price_currency, pay_currency",
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

    const paymentData = {
      price_amount: parseFloat(price_amount),
      price_currency,
      pay_currency,
      order_id,
      order_description,
      ipn_callback_url,
      is_fixed_rate: true,
      is_fee_paid_by_user: false,
    };

    console.log("Creating NOWPayments payment:", {
      order_id,
      price_amount,
      price_currency,
      pay_currency,
    });

    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "NOWPayments payment API error:",
        response.status,
        errorData
      );
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("NOWPayments payment created:", {
      payment_id: data.payment_id,
      payment_status: data.payment_status,
      pay_address: data.pay_address,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating NOWPayments payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
