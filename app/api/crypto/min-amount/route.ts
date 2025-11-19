import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currencyFrom = searchParams.get("currency_from");

    if (!currencyFrom) {
      return NextResponse.json(
        { error: "currency_from is required" },
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

    const url = `https://api.nowpayments.io/v1/min-amount?currency_from=${currencyFrom}&currency_to=trx&fiat_equivalent=usd&is_fixed_rate=false&is_fee_paid_by_user=false`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "NOWPayments min-amount API error:",
        response.status,
        errorData
      );
      return NextResponse.json(
        { error: "Failed to fetch minimum amount" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching minimum amount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
