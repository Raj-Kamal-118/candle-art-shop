import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.cookies.get("user_session")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      paymentMethod,
      codFee = 0,
      total,
      paymentReference,
      paymentScreenshot,
    } = body;

    // Fetch the order and verify ownership
    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (order.status !== "payment_pending") {
      return NextResponse.json({ error: "This order cannot be retried" }, { status: 400 });
    }

    // Validate the new total
    const giftDetails = order.gift_details as Record<string, number> | null;
    const wrapFee = giftDetails?.wrapFee || 0;
    const greetingCardFee = giftDetails?.greetingCardFee || 0;
    const expectedTotal =
      Number(order.subtotal) -
      Number(order.discount) +
      Number(order.shipping) +
      codFee +
      wrapFee +
      greetingCardFee;
    if (Math.abs(total - expectedTotal) > 1) {
      return NextResponse.json({ error: "Order total mismatch" }, { status: 400 });
    }

    // Handle UPI screenshot upload
    let screenshotUrl: string | null = null;
    if (paymentScreenshot && paymentMethod === "upi") {
      const matches = paymentScreenshot.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const fileExt = mimeType.split("/")[1] || "png";
        const fileName = `upi-proofs/retry_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const BUCKET = "order-attachments";

        const { data: uploadData } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, buffer, { contentType: mimeType, upsert: false });

        if (uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(fileName);
          screenshotUrl = publicUrlData.publicUrl;
        }
      }
    }

    const newStatus =
      paymentMethod === "online"
        ? "payment_pending"
        : paymentMethod === "upi"
          ? "payment_verification"
          : "pending";

    const updateData: Record<string, unknown> = {
      payment_method: paymentMethod,
      status: newStatus,
      total,
    };
    if (paymentReference) updateData.payment_reference = paymentReference;
    if (screenshotUrl) updateData.payment_screenshot_url = screenshotUrl;

    const { error: updateErr } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id);

    if (updateErr) throw updateErr;

    // Send notifications for non-online payment methods (online waits for PhonePe webhook)
    if (paymentMethod !== "online" && process.env.RESEND_API_KEY) {
      const addr = order.shipping_address as Record<string, string> | null;
      const customerEmail = order.customer_email || addr?.email;
      const isUpi = paymentMethod === "upi";

      // Admin notification
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `Artisan House Admin <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
            to: [process.env.ADMIN_EMAIL || "artisanhouse.in@gmail.com"],
            subject: isUpi
              ? `⚠️ Payment Verification Required! #${id}`
              : `🎉 New Order Received! #${id}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px; color: #4a3320;">
                <h2>${isUpi ? "Payment Verification Required" : "New Order Confirmed (COD)"}</h2>
                <p>Order <strong>#${id}</strong> was updated to <strong>${paymentMethod.toUpperCase()}</strong> after a failed PhonePe payment attempt.</p>
                <p><strong>Customer:</strong> ${addr?.fullName || "Unknown"} &mdash; ${customerEmail || "no email"}</p>
                <p><strong>Total:</strong> ₹${total}</p>
                ${isUpi && paymentReference ? `<p><strong>UPI Reference:</strong> ${paymentReference}</p>` : ""}
                ${isUpi && order.customer_phone ? `<p><strong>Phone:</strong> ${order.customer_phone}</p>` : ""}
                ${isUpi && screenshotUrl ? `<p><a href="${screenshotUrl}">View Payment Screenshot →</a></p>` : ""}
                <p><a href="https://artisanhouse.in/admin/orders" style="color: #D76E60; font-weight: bold;">View in Admin Dashboard →</a></p>
              </div>`,
          }),
        });
      } catch (e) {
        console.error("Failed to send retry admin email:", e);
      }

      // Customer confirmation for COD — UPI waits for admin verification
      if (paymentMethod === "cod" && customerEmail) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: `Artisan House <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
              to: [customerEmail],
              subject: `Order Confirmed: #${id} | Artisan House`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px; color: #4a3320;">
                  <h2>Order Confirmed!</h2>
                  <p>Hi ${addr?.fullName?.split(" ")[0] || "there"},</p>
                  <p>Your order <strong>#${id}</strong> has been confirmed. We're getting your handcrafted pieces ready!</p>
                  <p><strong>Total (Cash on Delivery):</strong> ₹${total}</p>
                  <p>
                    <a href="https://artisanhouse.in/order/${id}" style="display: inline-block; background-color: #D76E60; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                      View Order Status
                    </a>
                  </p>
                </div>`,
            }),
          });
        } catch (e) {
          console.error("Failed to send retry customer email:", e);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Order Retry Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retry order" },
      { status: 500 }
    );
  }
}
