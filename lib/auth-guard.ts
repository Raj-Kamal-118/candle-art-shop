import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN_VALUE = "authenticated";

export function isAdmin(request: NextRequest): boolean {
  return request.cookies.get("admin_token")?.value === ADMIN_TOKEN_VALUE;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Returns a 401 response if the request does not have a valid admin cookie.
 * Returns null if the request is authorized (caller should proceed).
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!isAdmin(request)) return unauthorized();
  return null;
}

/**
 * Verifies the requesting user owns the given order.
 * Admins bypass the ownership check.
 * Returns a 401 response if unauthorized, null if authorized.
 */
export function requireOrderOwnership(
  request: NextRequest,
  orderUserId: string | null | undefined
): NextResponse | null {
  if (isAdmin(request)) return null;

  const userId = request.cookies.get("user_session")?.value;
  if (!userId) return unauthorized();

  if (!orderUserId || orderUserId !== userId) return unauthorized();

  return null;
}
