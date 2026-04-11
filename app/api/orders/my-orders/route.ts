import { NextRequest, NextResponse } from "next/server";
import { getOrdersByUserId, getOrdersByPhone, getUserById } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("user_session")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch by user_id and also by phone (in case older orders were placed before account existed)
    const [byId, byPhone] = await Promise.all([
      getOrdersByUserId(userId),
      getOrdersByPhone(user.phone),
    ]);

    // Merge and deduplicate by order id
    const seen = new Set<string>();
    const orders = [...byId, ...byPhone].filter((o) => {
      if (seen.has(o.id)) return false;
      seen.add(o.id);
      return true;
    });

    // Sort newest first
    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ orders, user });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
