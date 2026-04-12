import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { orderId, amount, phone } = await req.json();

    const env = (process.env.NEXT_PUBLIC_PHONEPE_ENV ?? "UAT").replace(/['"]/g, "").trim().toUpperCase(); 

    const merchantId = (process.env.PHONEPE_MERCHANT_ID || "").replace(/['"]/g, "").trim();
    const saltKey = (process.env.PHONEPE_SALT_KEY || "").replace(/['"]/g, "").trim();
    const saltIndex = (process.env.PHONEPE_SALT_INDEX || "1").replace(/['"]/g, "").trim();

    let baseUrl = env === "PROD" 
      ? "https://api.phonepe.com/apis/hermes" 
      : "https://api-preprod.phonepe.com/apis/hermes";

    // SAFETY NET: If your .env still has the test Merchant ID but is accidentally set to PROD,
    // this forces the URL back to the Sandbox so it doesn't get rejected by the live servers.
    if (merchantId.startsWith("PGTEST")) {
      baseUrl = "https://api-preprod.phonepe.com/apis/hermes";
    }

    if (!merchantId || !saltKey) {
      return NextResponse.json({ error: "Payment gateway keys are missing" }, { status: 400 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

    const payload = {
      merchantId,
      merchantTransactionId: orderId,
      merchantUserId: `MUID-${Date.now()}`,
      amount: Math.round(amount * 100), // PhonePe expects amount in Paise
      redirectUrl: `${appUrl}/api/payment/phonepe-callback`,
      redirectMode: "POST",
      callbackUrl: `${appUrl}/api/payment/phonepe-callback`,
      // PhonePe strictly expects a valid 10 digit number
      mobileNumber: phone ? phone.replace(/\D/g, '').slice(-10).padStart(10, '9') : "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const sign = crypto.createHash("sha256").update(payloadBase64 + "/pg/v1/pay" + saltKey).digest("hex");
    const xVerify = `${sign}###${saltIndex}`;

    const response = await fetch(`${baseUrl}/pg/v1/pay`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-VERIFY": xVerify
      },
      body: JSON.stringify({ request: payloadBase64 })
    });

    const data = await response.json();

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({ url: data.data.instrumentResponse.redirectInfo.url });
    }
    
    console.error("PhonePe API Error:", data);
    return NextResponse.json({ error: "Failed to initiate payment", details: data }, { status: 400 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
