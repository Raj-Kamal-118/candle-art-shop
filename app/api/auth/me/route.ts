import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("user_session")?.value;
    if (!userId) {
      return NextResponse.json({ user: null });
    }
    const user = await getUserById(userId);
    return NextResponse.json({ user: user ?? null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
