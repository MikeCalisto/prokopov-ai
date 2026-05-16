import { NextRequest, NextResponse } from "next/server";
import { notifyTelegram, formatLead } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const { email, phone } = await req.json();

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email i telefon są wymagane" },
        { status: 400 }
      );
    }

    const posId = process.env.PAYU_POS_ID!;
    const clientId = process.env.PAYU_CLIENT_ID!;
    const clientSecret = process.env.PAYU_CLIENT_SECRET!;
    const isSandbox = process.env.PAYU_SANDBOX === "true";

    const baseUrl = isSandbox
      ? "https://secure.snd.payu.com"
      : "https://secure.payu.com";

    const siteBase =
      process.env.NEXT_PUBLIC_SITE_URL || "https://prokopov-ai.vercel.app";

    // 1) OAuth: client_credentials
    const tokenRes = await fetch(`${baseUrl}/pl/standard/user/oauth/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      console.error("PayU OAuth error:", tokenRes.status, t);
      return NextResponse.json(
        { error: "Błąd autoryzacji u operatora płatności" },
        { status: 500 }
      );
    }

    const tokenData = (await tokenRes.json()) as { access_token: string };
    const accessToken = tokenData.access_token;

    // 2) Create order
    const customerIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const extOrderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const orderPayload = {
      notifyUrl: `${siteBase}/api/webhook-payu`,
      continueUrl: `${siteBase}/ai-avatar-pl/thank-you`,
      customerIp,
      merchantPosId: posId,
      description: "Kurs AI Avatar",
      currencyCode: "PLN",
      totalAmount: "7900", // 79.00 PLN w groszach
      extOrderId,
      buyer: {
        email,
        phone,
        language: "pl",
      },
      products: [
        {
          name: "Kurs online: AI Avatar",
          unitPrice: "7900",
          quantity: "1",
        },
      ],
    };

    // PayU returns 302 with redirectUri in JSON. We must NOT follow the redirect.
    const orderRes = await fetch(`${baseUrl}/api/v2_1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
      redirect: "manual",
    });

    // PayU sends 200 lub 302 z JSON-em zawierającym redirectUri
    const orderText = await orderRes.text();
    let orderData: { redirectUri?: string; status?: { statusCode?: string; statusDesc?: string } };
    try {
      orderData = JSON.parse(orderText);
    } catch {
      console.error("PayU createOrder non-JSON response:", orderText);
      return NextResponse.json(
        { error: "Nieprawidłowa odpowiedź od operatora płatności" },
        { status: 500 }
      );
    }

    if (orderData.redirectUri) {
      console.log("PayU order created:", { extOrderId, status: orderData.status });
      await notifyTelegram(
        formatLead({
          site: "PayU",
          page: "/ai-avatar-pl",
          email,
          phone,
          amount: "79 zł",
          orderId: extOrderId,
        })
      );
      return NextResponse.json({ redirectUrl: orderData.redirectUri });
    }

    console.error("PayU createOrder failed:", orderData);
    return NextResponse.json(
      {
        error: `Błąd płatności: ${
          orderData.status?.statusDesc || "nieznany błąd"
        }`,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("PayU payment API error:", error);
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}
