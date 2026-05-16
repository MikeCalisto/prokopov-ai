import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { notifyTelegram, formatPayment } from "@/lib/notifications";

// PayU notification (notifyUrl). PayU sends POST with JSON body and signature
// in OpenPayu-Signature header (format: sender=...;signature=...;algorithm=MD5;content=DOCUMENT)
// Signature = MD5(rawBody + secondKey)
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sigHeader = req.headers.get("openpayu-signature") || "";

    const secondKey = process.env.PAYU_SECOND_KEY || "";

    // Parse signature header
    const sigParts = Object.fromEntries(
      sigHeader.split(";").map((p) => {
        const [k, v] = p.split("=");
        return [k?.trim(), v?.trim()];
      })
    );
    const receivedSig = sigParts["signature"];
    const algorithm = (sigParts["algorithm"] || "MD5").toUpperCase();

    if (!receivedSig || !secondKey) {
      console.error("PayU webhook: missing signature or second key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expectedSig =
      algorithm === "MD5"
        ? crypto.createHash("md5").update(rawBody + secondKey).digest("hex")
        : crypto.createHash("sha256").update(rawBody + secondKey).digest("hex");

    if (expectedSig.toLowerCase() !== receivedSig.toLowerCase()) {
      console.error("PayU webhook: signature mismatch", {
        expectedSig,
        receivedSig,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as {
      order?: {
        orderId?: string;
        extOrderId?: string;
        status?: string;
        totalAmount?: string;
        currencyCode?: string;
        buyer?: { email?: string };
      };
    };

    const order = payload.order;
    console.log("PayU webhook received:", {
      orderId: order?.orderId,
      extOrderId: order?.extOrderId,
      status: order?.status,
      amount: order?.totalAmount,
      email: order?.buyer?.email,
    });

    if (order?.status === "COMPLETED") {
      console.log("PayU payment COMPLETED:", order.extOrderId);
      // Convert amount from grosze to zł for readability (e.g. 7900 -> "79.00")
      const amountZl = order.totalAmount
        ? (Number(order.totalAmount) / 100).toFixed(2)
        : "?";
      await notifyTelegram(
        formatPayment({
          site: "PayU",
          amount: amountZl,
          currency: order.currencyCode || "PLN",
          email: order.buyer?.email,
          orderId: order.extOrderId || order.orderId || "—",
          status: order.status,
        })
      );
      // TODO: tu wyślij dostęp do kursu (Telegram bot link / e-mail)
    } else if (order?.status === "CANCELED") {
      console.log("PayU payment CANCELED:", order.extOrderId);
    } else if (order?.status === "PENDING" || order?.status === "WAITING_FOR_CONFIRMATION") {
      console.log("PayU payment in progress:", order.status, order.extOrderId);
    }

    // PayU expects HTTP 200 to consider notification delivered
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("PayU webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
