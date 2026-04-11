import { NextRequest, NextResponse } from "next/server";
import {
  getLatestOTPSession,
  markOTPVerified,
  getUserByPhone,
  createUser,
} from "@/lib/data";
import { generateId } from "@/lib/utils";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name, email } = await request.json();
    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    const session = await getLatestOTPSession(normalizedPhone);

    if (!session) {
      return NextResponse.json(
        { error: "No OTP found for this number. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (session.otp !== otp.trim()) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    await markOTPVerified(session.id);

    // Get or create user
    let user = await getUserByPhone(normalizedPhone);
    if (!user) {
      user = await createUser({
        id: generateId("usr"),
        phone: normalizedPhone,
        name: name || undefined,
        email: email || undefined,
      });
    } else if ((name && !user.name) || (email && !user.email)) {
      // Backfill missing name/email if provided
      const { updateUser } = await import("@/lib/data");
      const updated = await updateUser(user.id, {
        name: name || user.name,
        email: email || user.email,
      });
      if (updated) user = updated;
    }

    // Create session cookie (httpOnly, 30-day expiry)
    const response = NextResponse.json({ success: true, user });
    response.cookies.set("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
