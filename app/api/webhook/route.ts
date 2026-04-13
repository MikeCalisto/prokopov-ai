import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // P24 sends form-encoded data
    const formData = await req.text();
    const params = new URLSearchParams(formData);

    const sessionId = params.get("p24_session_id") || "";
    const amount = params.get("p24_amount") || "";
    const currency = params.get("p24_currency") || "PLN";
    const orderId = params.get("p24_order_id") || "";

    console.log("Webhook received:", { sessionId, orderId, amount, currency });

    const merchantId = Number(process.env.P24_MERCHANT_ID);
    const posId = Number(process.env.P24_POS_ID);
    const crcKey = process.env.P24_CRC_KEY!;
    const isSandbox = process.env.P24_SANDBOX === "true";

    const baseUrl = isSandbox
      ? "https://sandbox.przelewy24.pl"
      : "https://secure.przelewy24.pl";

    // Verification sign: md5 of sessionId|orderId|amount|currency|crc
    const signString = `${sessionId}|${orderId}|${amount}|${currency}|${crcKey}`;
    const sign = crypto.createHash("md5").update(signString).digest("hex");

    const verifyParams = new URLSearchParams({
      p24_merchant_id: String(merchantId),
      p24_pos_id: String(posId),
      p24_session_id: sessionId,
      p24_amount: amount,
      p24_currency: currency,
      p24_order_id: orderId,
      p24_sign: sign,
    });

    const verifyResponse = await fetch(`${baseUrl}/trnVerify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: verifyParams.toString(),
    });

    const verifyText = await verifyResponse.text();
    console.log("Verification result:", verifyText);

    if (verifyText.includes("error=0")) {
      console.log("Payment verified successfully:", sessionId);
    } else {
      console.error("Payment verification failed:", verifyText);
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
