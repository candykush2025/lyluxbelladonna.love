import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/lib/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("NOWPayments webhook received:", {
      invoice_id: body.invoice_id,
      order_id: body.order_id,
      price_amount: body.price_amount,
      price_currency: body.price_currency,
      pay_amount: body.pay_amount,
      pay_currency: body.pay_currency,
      status: body.status,
    });

    const { invoice_id, order_id, status } = body;

    // Validate required fields
    if (!invoice_id || !order_id) {
      console.error("Missing required fields in webhook:", {
        invoice_id,
        order_id,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the payment by fetching invoice details from NOWPayments API
    // This is crucial for security - never trust webhook data alone
    const apiKey = process.env.NOWPAYMENT_API_KEY;
    if (!apiKey) {
      console.error("NOWPAYMENT_API_KEY not configured");
      return NextResponse.json(
        { error: "Service not configured" },
        { status: 500 }
      );
    }

    try {
      const verifyResponse = await fetch(
        `https://api.nowpayments.io/v1/invoice/${invoice_id}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      if (!verifyResponse.ok) {
        console.error("Failed to verify invoice with NOWPayments API");
        return NextResponse.json(
          { error: "Verification failed" },
          { status: 500 }
        );
      }

      const verifiedInvoice = await verifyResponse.json();

      // Verify that the webhook data matches the verified invoice
      if (
        verifiedInvoice.order_id !== order_id ||
        verifiedInvoice.price_amount !== body.price_amount ||
        verifiedInvoice.price_currency !== body.price_currency
      ) {
        console.error("Webhook data mismatch with verified invoice");
        return NextResponse.json(
          { error: "Data verification failed" },
          { status: 400 }
        );
      }

      // Use the verified status from the API, not the webhook
      const verifiedStatus = verifiedInvoice.status?.toLowerCase();
      console.log("Verified invoice status:", verifiedStatus);

      // Update order based on payment status
      let paymentStatus = "pending";
      let orderStatus = "pending";

      switch (verifiedStatus) {
        case "finished":
        case "paid":
          paymentStatus = "paid";
          orderStatus = "processing";
          console.log(`Cryptocurrency payment completed for order ${order_id}`);
          break;

        case "confirming":
          paymentStatus = "confirming";
          orderStatus = "pending";
          console.log(
            `Cryptocurrency payment confirming for order ${order_id}`
          );
          break;

        case "waiting":
          paymentStatus = "waiting";
          orderStatus = "pending";
          console.log(
            `Waiting for cryptocurrency payment for order ${order_id}`
          );
          break;

        case "expired":
        case "canceled":
        case "failed":
          paymentStatus = "failed";
          orderStatus = "cancelled";
          console.log(
            `Cryptocurrency payment failed/expired for order ${order_id}`
          );
          break;

        default:
          console.log(
            `Unknown payment status: ${verifiedStatus} for order ${order_id}`
          );
          break;
      }

      // Update the order in Firestore
      await updateOrder(order_id, {
        paymentStatus,
        orderStatus,
        paymentMethod: "crypto",
        paymentDetails: {
          provider: "nowpayments",
          invoiceId: invoice_id,
          payAmount: verifiedInvoice.pay_amount,
          payCurrency: verifiedInvoice.pay_currency,
          priceAmount: verifiedInvoice.price_amount,
          priceCurrency: verifiedInvoice.price_currency,
          lastUpdated: new Date(),
        },
      });

      console.log(
        `Order ${order_id} updated: paymentStatus=${paymentStatus}, orderStatus=${orderStatus}`
      );
    } catch (verifyError) {
      console.error("Error verifying invoice:", verifyError);
      return NextResponse.json(
        { error: "Verification error" },
        { status: 500 }
      );
    }

    // Return success response to acknowledge webhook
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing NOWPayments webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
