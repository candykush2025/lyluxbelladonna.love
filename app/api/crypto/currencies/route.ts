import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.NOWPAYMENT_API_KEY;
    if (!apiKey) {
      console.error("NOWPAYMENT_API_KEY not configured");
      return NextResponse.json(
        { error: "NOWPayments service not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.nowpayments.io/v1/currencies?fixed_rate=true",
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "NOWPayments currencies API error:",
        response.status,
        errorData
      );
      return NextResponse.json(
        { error: "Failed to fetch currencies" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
