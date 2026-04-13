import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantId, posId, sessionId, amount, currency, orderId } = body;

    console.log("Webhook received:", { sessionId, orderId, amount, currency, merchantId, posId });

    const crcKey = process.env.P24_CRC_KEY!;
    const apiKey = process.env.P24_API_KEY!;
    const isSandbox = process.env.P24_SANDBOX === "true";
    const verifyMerchantId = Number(process.env.P24_MERCHANT_ID);
    const verifyPosId = Number(process.env.P24_POS_ID);

    const baseUrl = isSandbox
      ? "https://sandbox.przelewy24.pl"
      : "https://secure.przelewy24.pl";

    // Generate verification sign
    const verifySignPayload = JSON.stringify({
      sessionId,
      orderId,
      amount,
      currency,
      crc: crcKey,
    });
    const verifySign = crypto
      .createHash("sha384")
      .update(verifySignPayload)
      .digest("hex");

    // Verify transaction with P24
    const verifyResponse = await fetch(
      `${baseUrl}/api/v1/transaction/verify`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${verifyPosId}:${apiKey}`).toString("base64")}`,
        },
        body: JSON.stringify({
          merchantId: verifyMerchantId,
          posId: verifyPosId,
          sessionId,
          amount,
          currency,
          orderId,
          sign: verifySign,
        }),
      }
    );

    const verifyData = await verifyResponse.json();
    console.log("Verification result:", verifyData);

    if (verifyData.data?.status === "success") {
      console.log("Payment verified successfully for session:", sessionId);
    } else {
      console.error("Payment verification failed:", verifyData);
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
