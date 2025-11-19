import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Payment ID is required" },
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

    const response = await fetch(
      `https://api.nowpayments.io/v1/payment/${id}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "NOWPayments payment status API error:",
        response.status,
        errorData
      );
      return NextResponse.json(
        { error: "Failed to check payment status" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
