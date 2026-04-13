import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantId, posId, sessionId, amount, originAmount, currency, orderId, methodId, statement, sign: receivedSign } = body;

    console.log("Webhook received:", { sessionId, orderId, amount, currency });

    const crcKey = process.env.P24_CRC_KEY!;
    const apiKey = process.env.P24_API_KEY!;
    const isSandbox = process.env.P24_SANDBOX === "true";

    const baseUrl = isSandbox
      ? "https://sandbox.przelewy24.pl"
      : "https://secure.przelewy24.pl";

    // Verify transaction
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

    const verifyResponse = await fetch(
      `${baseUrl}/api/v1/transaction/verify`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${posId}:${apiKey}`).toString("base64")}`,
        },
        body: JSON.stringify({
          merchantId: Number(process.env.P24_MERCHANT_ID),
          posId: Number(process.env.P24_POS_ID),
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

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
