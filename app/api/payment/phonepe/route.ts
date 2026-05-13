import { NextResponse } from "next/server";
import { getPhonePeToken, getPhonePePgBaseUrl } from "@/lib/phonepe";

export async function POST(req: Request) {
  try {
    const { orderId, amount } = await req.json();

    const clientId = (process.env.PHONEPE_CLIENT_ID || "").trim();
    if (!clientId) {
      return NextResponse.json({ error: "Payment gateway keys are missing" }, { status: 400 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

    const token = await getPhonePeToken();
    const pgBaseUrl = getPhonePePgBaseUrl();

    const payload = {
      merchantOrderId: orderId,
      amount: Math.round(amount * 100), // PhonePe expects paise
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: `${appUrl}/api/payment/phonepe-callback?merchantOrderId=${encodeURIComponent(orderId)}`,
        },
      },
    };

    const response = await fetch(`${pgBaseUrl}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.redirectUrl) {
      return NextResponse.json({ url: data.redirectUrl });
    }

    console.error("PhonePe API Error:", data);
    return NextResponse.json(
      { error: "Failed to initiate payment", details: data },
      { status: 400 }
    );
  } catch (error) {
    console.error("PhonePe Payment Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
