import { NextRequest, NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { orderId, invoiceId } = await req.json();

    if (!orderId || !invoiceId) {
      return NextResponse.json(
        { error: "Order ID and Invoice ID are required" },
        { status: 400 }
      );
    }

    // Get the invoice status from Xendit
    const response = await fetch(
      `https://api.xendit.co/v2/invoices/${invoiceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.XENDIT_SECRET_KEY + ":"
          ).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Xendit API error:", errorData);
      return NextResponse.json(
        { error: "Failed to check payment status" },
        { status: response.status }
      );
    }

    const invoice = await response.json();
    console.log("Invoice status from Xendit:", invoice.status);

    // Map Xendit status to our payment status
    let paymentStatus = "pending";
    let orderStatus = "pending";

    if (invoice.status === "PAID" || invoice.status === "SETTLED") {
      paymentStatus = "paid";
      orderStatus = "processing";
    } else if (invoice.status === "EXPIRED") {
      paymentStatus = "expired";
      orderStatus = "cancelled";
    }

    // Update the order in Firestore
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      paymentStatus,
      status: orderStatus,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      paymentStatus,
      orderStatus,
      xenditStatus: invoice.status,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
