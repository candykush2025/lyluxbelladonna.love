import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/lib/firestore";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const webhookData = JSON.parse(body);

    // Verify webhook signature (Xendit uses callback token for verification)
    const callbackToken = request.headers.get("x-callback-token");
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (expectedToken && callbackToken !== expectedToken) {
      console.error("Invalid webhook token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Xendit webhook received:", {
      id: webhookData.id,
      external_id: webhookData.external_id,
      status: webhookData.status,
      paid_amount: webhookData.paid_amount,
    });

    // Extract order ID from external_id
    const orderId = webhookData.external_id;
    const status = webhookData.status?.toLowerCase();

    if (!orderId) {
      console.error("No external_id (orderId) in webhook data");
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // Update order based on payment status
    let paymentStatus = "pending";
    let orderStatus = "pending";

    switch (status) {
      case "paid":
      case "settled":
        paymentStatus = "paid";
        orderStatus = "processing";
        console.log(`Payment completed for order ${orderId}`);
        break;

      case "expired":
        paymentStatus = "expired";
        orderStatus = "cancelled";
        console.log(`Payment expired for order ${orderId}`);
        break;

      case "pending":
        paymentStatus = "pending";
        orderStatus = "pending";
        break;

      default:
        console.log(`Unknown payment status: ${status} for order ${orderId}`);
        paymentStatus = status;
    }

    // Update order in Firestore
    await updateOrder(orderId, {
      paymentStatus,
      status: orderStatus,
      xenditInvoiceId: webhookData.id,
      xenditStatus: webhookData.status,
      paidAmount: webhookData.paid_amount || 0,
      paymentCompletedAt:
        status === "paid" || status === "settled"
          ? new Date().toISOString()
          : null,
      updatedAt: new Date().toISOString(),
    });

    console.log(
      `Order ${orderId} updated: paymentStatus=${paymentStatus}, orderStatus=${orderStatus}`
    );

    // Return success response to Xendit
    return NextResponse.json({
      success: true,
      orderId,
      paymentStatus,
      orderStatus,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Still return 200 to prevent Xendit from retrying
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}

// GET endpoint for webhook verification (some payment providers require this)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "active",
    service: "Xendit Webhook Handler",
  });
}
