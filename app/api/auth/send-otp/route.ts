import { NextRequest, NextResponse } from "next/server";
import { createOTPSession } from "@/lib/data";
import { generateId } from "@/lib/utils";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(phone: string): string {
  // Strip spaces, dashes, dots; ensure +91 prefix for Indian numbers
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);
    // Validate Indian mobile number: +91 followed by 10 digits starting with 6-9
    const indianPhoneRegex = /^\+91[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid Indian mobile number" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    await createOTPSession({
      id: generateId("otp"),
      phone: normalizedPhone,
      otp,
      expiresAt,
    });

    // ─── SMS Integration ────────────────────────────────────────────────────
    // In production, replace the block below with your SMS provider.
    // Recommended for India: MSG91, Fast2SMS, TextLocal, or Twilio.
    //
    // Example with MSG91:
    //   await fetch("https://api.msg91.com/api/v5/otp", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", "authkey": process.env.MSG91_AUTH_KEY! },
    //     body: JSON.stringify({ template_id: process.env.MSG91_TEMPLATE_ID, mobile: normalizedPhone, otp }),
    //   });
    //
    // For now, the OTP is returned in the response so you can test without SMS.
    // REMOVE the `otp` field from the response in production!
    // ───────────────────────────────────────────────────────────────────────

    return NextResponse.json({
      success: true,
      phone: normalizedPhone,
      // TODO: Remove `otp` from response in production — use real SMS instead
      otp: process.env.NODE_ENV !== "production" ? otp : undefined,
      message: `OTP sent to ${normalizedPhone}`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
