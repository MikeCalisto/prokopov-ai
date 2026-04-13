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
    const isSandbox = process.env.P24_SANDBOX === "true";

    const baseUrl = isSandbox
      ? "https://sandbox.przelewy24.pl"
      : "https://secure.przelewy24.pl";

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const amount = 7900;
    const currency = "PLN";
    const siteBase =
      process.env.NEXT_PUBLIC_SITE_URL || "https://prokopov-ai.vercel.app";

    // CRC sign for trnRegister: md5 of sessionId|posId|amount|currency|crc
    const signString = `${sessionId}|${posId}|${amount}|${currency}|${crcKey}`;
    const sign = crypto.createHash("md5").update(signString).digest("hex");

    // Use classic trnRegister endpoint (form POST)
    const params = new URLSearchParams({
      p24_merchant_id: String(merchantId),
      p24_pos_id: String(posId),
      p24_session_id: sessionId,
      p24_amount: String(amount),
      p24_currency: currency,
      p24_description: "Kurs AI Avatar",
      p24_email: email,
      p24_country: "PL",
      p24_language: "pl",
      p24_url_return: `${siteBase}/ai-avatar/thank-you`,
      p24_url_status: `${siteBase}/api/webhook`,
      p24_api_version: "3.2",
      p24_sign: sign,
      p24_encoding: "UTF-8",
    });

    console.log("P24 trnRegister request:", {
      url: `${baseUrl}/trnRegister`,
      posId,
      merchantId,
      sessionId,
      amount,
    });

    const response = await fetch(`${baseUrl}/trnRegister`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    console.log("P24 trnRegister response:", responseText);

    // Parse response (format: error=0&token=XXX or error=NNN&errorMessage=XXX)
    const resParams = new URLSearchParams(responseText);
    const errorCode = resParams.get("error");
    const token = resParams.get("token");

    if (errorCode === "0" && token) {
      console.log("P24 token received:", token);
      return NextResponse.json({
        redirectUrl: `${baseUrl}/trnRequest/${token}`,
      });
    }

    const errorMsg = resParams.get("errorMessage") || responseText.substring(0, 200);
    console.error("P24 trnRegister error:", { errorCode, errorMsg });
    return NextResponse.json(
      { error: `Błąd płatności: ${errorMsg}` },
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
