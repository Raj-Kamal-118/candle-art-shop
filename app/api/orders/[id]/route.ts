import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth-guard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Admin can view any order.
    // If the order belongs to a registered user, require a matching session.
    // Guest orders (no user_id) are accessible by ID alone — the UUID is unguessable.
    const adminToken = request.cookies.get("admin_token")?.value;
    const isAdmin = adminToken === "authenticated";
    if (!isAdmin && data.user_id) {
      const userId = request.cookies.get("user_session")?.value;
      if (!userId || userId !== data.user_id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deny = requireAdmin(request);
  if (deny) return deny;
  try {
    const body = await request.json();
    const { status, paymentReference, isTest } = body;

    // Fetch current order to detect payment_verification → verified transition
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!currentOrder) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (paymentReference) updates.payment_reference = paymentReference;
    if (isTest !== undefined) updates.is_test = isTest;

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    // When admin moves a UPI order out of payment_verification (and not cancelling),
    // fire the customer confirmation email that was held back at order creation.
    const wasAwaitingVerification = currentOrder.status === "payment_verification";
    const isNowVerified = status && status !== "payment_verification" && status !== "cancelled";

    if (wasAwaitingVerification && isNowVerified && process.env.RESEND_API_KEY) {
      const addr = currentOrder.shipping_address as any;
      const items = (currentOrder.items as any[]) || [];

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `Artisan House <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
            to: [addr?.email],
            subject: `Order Confirmed: #${params.id} | Artisan House`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfbf9; padding: 40px 20px; color: #4a3320;">
                <div style="background-color: #ffffff; border: 1px solid #e5dcd3; border-radius: 16px; padding: 40px; box-shadow: 0 8px 24px rgba(74, 51, 32, 0.04);">

                  <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://pub-1f6a6fc4e92548b987db5dbea7cd456e.r2.dev/candle-art-shop-images/Asset/assets-03%20(2).png" alt="Artisan House Logo" style="width: 64px; height: 64px; border-radius: 50%; display: block; margin: 0 auto 12px auto;" />
                    <span style="display: block; font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #4a3320;">Artisan House</span>
                    <span style="display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #b45309; margin-top: 4px;">Candles &middot; Clays &middot; Crafts</span>
                    <h2 style="margin: 24px 0 0 0; color: #4a3320; font-size: 24px; font-weight: bold; border-top: 1px solid #e5dcd3; padding-top: 24px;">Payment Verified — Order Confirmed!</h2>
                  </div>

                  <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 14px; color: #15803d; font-weight: 600;">✅ Your UPI payment has been verified. We're now getting your handcrafted pieces ready!</p>
                  </div>

                  <p style="font-size: 15px; line-height: 1.6; color: #5c4028; margin-bottom: 25px;">
                    Hi ${addr?.fullName?.split(" ")[0] || "there"},<br><br>
                    Great news — we've verified your UPI payment and your order is now confirmed. We're starting to prepare your pieces with care and intention. We'll send you another update as soon as it ships.
                  </p>

                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Order ID</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600;">#${params.id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50; vertical-align: top;">Shipping To</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600;">
                        ${addr?.address1 || ""}<br>
                        ${addr?.city || ""}, ${addr?.state || ""} ${addr?.postalCode || ""}
                      </td>
                    </tr>
                  </table>

                  <div style="background-color: #fdfbf9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #4a3320; border-bottom: 1px solid #e5dcd3; padding-bottom: 10px;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      ${items.map((item: any) => `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; color: #4a3320;">
                            <div style="font-weight: 600; font-size: 15px;">${item.productName}</div>
                            <div style="color: #8c6a50; margin-top: 4px;">Qty: ${item.quantity}</div>
                            ${item.customizations && Object.keys(item.customizations).length > 0 ?
                              `<div style="color: #8c6a50; font-size: 13px; margin-top: 4px;">${Object.entries(item.customizations).map(([k, v]) => `&bull; ${k}: ${v}`).join("<br>")}</div>` : ""}
                            ${item.giftSet?.picks?.length > 0 ? `
                              <div style="margin-top: 10px; padding: 12px; background-color: #faf7f0; border: 1px solid #eedcc5; border-radius: 8px;">
                                <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; margin-bottom: 6px;">Inside the Box</div>
                                ${item.giftSet.picks.map((pick: any) => `<div style="font-size: 13px; color: #4a3320; margin-bottom: 4px;">&bull; ${pick.name}${pick.qty > 1 ? ` &times; ${pick.qty}` : ""}</div>`).join("")}
                              </div>
                            ` : ""}
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; text-align: right; font-weight: 600; color: #4a3320; vertical-align: top;">
                            ₹${item.price * item.quantity}
                          </td>
                        </tr>
                      `).join("")}
                      <tr>
                        <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #4a3320; text-align: right;">Total</td>
                        <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #D76E60; text-align: right;">₹${currentOrder.total}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center;">
                    <a href="https://artisanhouse.in/order/${params.id}" target="_blank" style="display: inline-block; background-color: #D76E60; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">View Order Status</a>
                  </div>
                </div>
              </div>`,
          }),
        });
        console.log("[Resend Success]: Customer confirmation email sent after UPI verification for order", params.id);
      } catch (emailErr) {
        console.error("[Resend Error]: Failed to send post-verification email:", emailErr);
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
