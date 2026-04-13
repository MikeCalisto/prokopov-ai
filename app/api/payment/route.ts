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

    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || "https://prokopov-ai.vercel.app";

    const authString = `${posId}:${apiKey}`;
    const authBase64 = Buffer.from(authString).toString("base64");

    const requestBody = {
      merchantId,
      posId,
      sessionId,
      amount,
      currency,
      description: "Kurs AI Avatar",
      email,
      country: "PL",
      language: "pl",
      urlReturn: `${siteBase}/ai-avatar/thank-you`,
      urlStatus: `${siteBase}/api/webhook`,
      sign,
    };

    console.log("P24 Request:", {
      url: `${baseUrl}/api/v1/transaction/register`,
      posId,
      merchantId,
      isSandbox,
      authStringPreview: `${posId}:${apiKey.substring(0, 6)}...`,
    });

    // Register transaction
    const response = await fetch(`${baseUrl}/api/v1/transaction/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authBase64}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("P24 Response status:", response.status);
    console.log("P24 Response body:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: `P24 zwrócił nieprawidłową odpowiedź: ${responseText.substring(0, 200)}` },
        { status: 500 }
      );
    }

    if (data.data?.token) {
      return NextResponse.json({
        redirectUrl: `${baseUrl}/trnRequest/${data.data.token}`,
      });
    }

    console.error("P24 registration error:", JSON.stringify(data));
    return NextResponse.json(
      { error: data.error || data.message || JSON.stringify(data) },
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
