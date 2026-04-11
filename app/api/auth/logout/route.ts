import { NextResponse } from "next/server";

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("user_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
