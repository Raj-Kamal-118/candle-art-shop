import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPhonePeToken, getPhonePePgBaseUrl } from "@/lib/phonepe";

// Use service role key so this server-to-server call can update orders
// without requiring an admin cookie (which fetch() can't send).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verifyAndUpdateOrder(
  merchantOrderId: string
): Promise<{ success: boolean; paymentRef: string; order: Record<string, unknown> | null }> {
  const token = await getPhonePeToken();
  const pgBaseUrl = getPhonePePgBaseUrl();

  const statusRes = await fetch(
    `${pgBaseUrl}/checkout/v2/order/${merchantOrderId}/status`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
    }
  );

  const statusData = await statusRes.json();

  if (statusData.state !== "COMPLETED") {
    return { success: false, paymentRef: "", order: null };
  }

  const paymentRef = statusData.paymentDetails?.[0]?.transactionId || "";

  // Fetch the order to get customer details for the confirmation email
  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("*")
    .eq("id", merchantOrderId)
    .maybeSingle();

  if (fetchErr) console.error("Failed to fetch order:", fetchErr);

  // Update order status directly via Supabase (avoids admin cookie requirement)
  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status: "processing", payment_reference: paymentRef })
    .eq("id", merchantOrderId);

  if (updateErr) console.error("Failed to update order status:", updateErr);

  // Send customer confirmation email now that payment is verified
  if (order && process.env.RESEND_API_KEY) {
    const addr = order.shipping_address as Record<string, string> | null;
    const customerEmail = addr?.email || order.customer_email;
    const items = (order.items as Array<Record<string, unknown>>) || [];

    if (customerEmail) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `Artisan House <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
            to: [customerEmail],
            subject: `Order Confirmed: #${merchantOrderId} | Artisan House`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfbf9; padding: 40px 20px; color: #4a3320;">
                <div style="background-color: #ffffff; border: 1px solid #e5dcd3; border-radius: 16px; padding: 40px; box-shadow: 0 8px 24px rgba(74, 51, 32, 0.04);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://pub-1f6a6fc4e92548b987db5dbea7cd456e.r2.dev/candle-art-shop-images/Asset/assets-03%20(2).png" alt="Artisan House Logo" style="width: 64px; height: 64px; border-radius: 50%; display: block; margin: 0 auto 12px auto;" />
                    <span style="display: block; font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #4a3320;">Artisan House</span>
                    <span style="display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #b45309; margin-top: 4px;">Candles &middot; Clays &middot; Crafts</span>
                    <h2 style="margin: 24px 0 0 0; color: #4a3320; font-size: 24px; font-weight: bold; border-top: 1px solid #e5dcd3; padding-top: 24px;">Order Confirmed</h2>
                  </div>
                  <p style="font-size: 15px; line-height: 1.6; color: #5c4028; margin-bottom: 25px;">
                    Hi ${addr?.fullName?.split(" ")[0] || "there"},<br><br>
                    Thank you for your order! Your payment was successful and we're getting your handcrafted pieces ready. We'll send you another update as soon as it ships.
                  </p>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Order ID</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600;">#${merchantOrderId}</td>
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
                      ${items.map((item) => `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; color: #4a3320;">
                            <div style="font-weight: 600; font-size: 15px;">${item.productName}</div>
                            <div style="color: #8c6a50; margin-top: 4px;">Qty: ${item.quantity}</div>
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; text-align: right; font-weight: 600; color: #4a3320; vertical-align: top;">
                            ₹${(item.price as number) * (item.quantity as number)}
                          </td>
                        </tr>
                      `).join("")}
                      <tr>
                        <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #4a3320; text-align: right;">Total</td>
                        <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #D76E60; text-align: right;">₹${order.total}</td>
                      </tr>
                    </table>
                  </div>
                  <div style="text-align: center;">
                    <a href="https://artisanhouse.in/order/${merchantOrderId}" target="_blank" style="display: inline-block; background-color: #D76E60; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">View Order Status</a>
                  </div>
                </div>
              </div>`,
          }),
        });
        if (!emailRes.ok) {
          console.error("[Resend Error]: PhonePe confirmation email failed", await emailRes.text());
        } else {
          console.log("[Resend Success]: PhonePe confirmation email sent to", customerEmail);
        }
      } catch (e) {
        console.error("[Resend Error]: Failed to send PhonePe confirmation email:", e);
      }
    }
  }

  return { success: true, paymentRef, order };
}

// PhonePe v2 redirects the user back via GET with ?merchantOrderId=...
export async function GET(req: Request) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const { searchParams } = new URL(req.url);
  const merchantOrderId = searchParams.get("merchantOrderId") || "";

  if (!merchantOrderId) {
    return NextResponse.redirect(`${appUrl}/checkout?status=FAILED`, 303);
  }

  try {
    const { success, paymentRef } = await verifyAndUpdateOrder(merchantOrderId);
    if (success) {
      return NextResponse.redirect(
        `${appUrl}/checkout?order=${merchantOrderId}&status=SUCCESS&ref=${paymentRef}`,
        303
      );
    }
    return NextResponse.redirect(
      `${appUrl}/checkout?order=${merchantOrderId}&status=FAILED`,
      303
    );
  } catch (error) {
    console.error("Callback GET Error:", error);
    return NextResponse.redirect(`${appUrl}/checkout?status=FAILED`, 303);
  }
}

// PhonePe may also POST for server-to-server (S2S) webhook notifications
export async function POST(req: Request) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const contentType = req.headers.get("content-type") || "";

  let merchantOrderId = "";
  let isS2S = false;

  if (contentType.includes("application/json")) {
    isS2S = true;
    const body = await req.json();
    merchantOrderId = body.merchantOrderId || body.data?.merchantOrderId || "";
  } else {
    const formData = await req.formData();
    merchantOrderId = formData.get("merchantOrderId")?.toString() || "";
  }

  if (!merchantOrderId) {
    if (isS2S) return NextResponse.json({ success: false }, { status: 400 });
    return NextResponse.redirect(`${appUrl}/checkout?status=FAILED`, 303);
  }

  try {
    const { success, paymentRef } = await verifyAndUpdateOrder(merchantOrderId);

    if (isS2S) {
      return NextResponse.json({ success: true });
    }

    if (success) {
      return NextResponse.redirect(
        `${appUrl}/checkout?order=${merchantOrderId}&status=SUCCESS&ref=${paymentRef}`,
        303
      );
    }
    return NextResponse.redirect(
      `${appUrl}/checkout?order=${merchantOrderId}&status=FAILED`,
      303
    );
  } catch (error) {
    console.error("Callback POST Error:", error);
    if (isS2S) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    return NextResponse.redirect(`${appUrl}/checkout?status=FAILED`, 303);
  }
}
