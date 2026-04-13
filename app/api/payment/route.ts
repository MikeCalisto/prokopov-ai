import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, phone } = await req.json();

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email i telefon są wymagane" },
        { status: 400 }
      );
    }

    const merchantId = Number(process.env.P24_MERCHANT_ID);
    const posId = Number(process.env.P24_POS_ID);
    const crcKey = process.env.P24_CRC_KEY!;
    const apiKey = process.env.P24_API_KEY!;
    const isSandbox = process.env.P24_SANDBOX === "true";

    const baseUrl = isSandbox
      ? "https://sandbox.przelewy24.pl"
      : "https://secure.przelewy24.pl";

    const sessionId = crypto.randomUUID();
    const amount = 7900;
    const currency = "PLN";

    // Generate SHA384 sign
    const signPayload = JSON.stringify({
      sessionId,
      merchantId,
      amount,
      currency,
      crc: crcKey,
    });
    const sign = crypto.createHash("sha384").update(signPayload).digest("hex");

    // Register transaction
    const response = await fetch(`${baseUrl}/api/v1/transaction/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${posId}:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        merchantId,
        posId,
        sessionId,
        amount,
        currency,
        description: "Kurs AI Avatar",
        email,
        country: "PL",
        language: "pl",
        urlReturn: "https://prokopov-ai.vercel.app/ai-avatar/thank-you",
        urlStatus: "https://prokopov-ai.vercel.app/api/webhook",
        sign,
      }),
    });

    const data = await response.json();

    if (data.data?.token) {
      return NextResponse.json({
        redirectUrl: `${baseUrl}/trnRequest/${data.data.token}`,
      });
    }

    console.error("P24 registration error:", data);
    return NextResponse.json(
      { error: "Błąd rejestracji płatności" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}
