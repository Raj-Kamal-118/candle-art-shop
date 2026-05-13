import { NextRequest, NextResponse } from "next/server";
import {
  getOrders,
  createOrder,
  updateDiscount,
  getDiscountByCode,
  hasUserUsedDiscount,
  getUserById,
  createUser,
  updateUser
} from "@/lib/data";
import { generateId } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Pull userId from session cookie (if logged in) or body fallback
    const userId = request.cookies.get("user_session")?.value || body.userId || undefined;

    // Prefer user's registered phone over shipping address phone
    const customerPhone =
      body.customerPhone ||
      body.shippingAddress?.phone ||
      undefined;

    // Prefer user's registered email (from verifiedUser) over shipping address email
    const customerEmail =
      body.customerEmail ||
      body.shippingAddress?.email ||
      undefined;

    const codFee = body.codFee || 0;

    let screenshotUrl = null;

    if (body.paymentScreenshot) {
      const matches = body.paymentScreenshot.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        const fileExt = mimeType.split("/")[1] || "png";
        const fileName = `upi-proofs/order_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const BUCKET = "order-attachments";

        // Ensure bucket exists (idempotent — no-ops if it already does)
        const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5 MB
        });
        if (bucketError && !bucketError.message.includes("already exists")) {
          console.error("Error creating storage bucket:", bucketError);
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: false
          });

        if (uploadError) {
          console.error("Error uploading screenshot:", uploadError);
        } else if (uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(fileName);

          screenshotUrl = publicUrlData.publicUrl;
        }
      }
    }

    // Prevent total mismatch / payload tampering
    const giftWrapFee = body.giftWrapFee || 0;
    const greetingCardFee = body.greetingCardFee || 0;
    const expectedTotal = body.subtotal - body.discount + body.shipping + codFee + giftWrapFee + greetingCardFee;
    if (Math.abs(body.total - expectedTotal) > 1) {
      return NextResponse.json({ error: "Order total mismatch" }, { status: 400 });
    }

    // Strict discount validation to prevent misuse
    if (body.discountCode) {
      const discount = await getDiscountByCode(body.discountCode);

      if (!discount) {
        return NextResponse.json({ error: "Invalid discount code" }, { status: 400 });
      }
      if (!discount.active) {
        return NextResponse.json({ error: "This discount code is no longer active" }, { status: 400 });
      }
      if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
        return NextResponse.json({ error: "This discount code has expired" }, { status: 400 });
      }
      if (discount.usedCount >= discount.maxUses) {
        return NextResponse.json({ error: "This discount code has reached its usage limit" }, { status: 400 });
      }
      if (body.subtotal < discount.minOrderAmount) {
        return NextResponse.json({ error: `Minimum order amount of ₹${discount.minOrderAmount} not met` }, { status: 400 });
      }

      // Enforce one-time use per customer
      if (discount.oneUsePerCustomer) {
        const alreadyUsed = await hasUserUsedDiscount(body.discountCode, userId, customerPhone);
        if (alreadyUsed) {
          return NextResponse.json({ error: "You have already used this discount code" }, { status: 400 });
        }
      }

      // Validate the discount amount wasn't tampered with on the frontend
      const expectedDiscount = discount.type === "percentage" ? Math.min(Math.round(body.subtotal * (discount.value / 100)), body.subtotal) : Math.min(discount.value, body.subtotal);
      if (Math.abs(body.discount - expectedDiscount) > 1) {
        return NextResponse.json({ error: "Discount amount mismatch. Please re-apply the code." }, { status: 400 });
      }
    }

    // Ensure the user exists in the public.users table (important for Google Auth users)
    if (userId) {
      try {
        let user = await getUserById(userId);
        if (!user) {
          user = await createUser({
            id: userId,
            phone: customerPhone || body.shippingAddress?.phone || "",
            name: body.shippingAddress?.fullName,
            email: body.shippingAddress?.email,
          });
        }

        // Backfill phone on user profile if it's missing
        const phoneFromOrder = customerPhone || body.shippingAddress?.phone;
        if (phoneFromOrder && !user.phone) {
          await updateUser(userId, { phone: phoneFromOrder });
        }

        // Save the shipping address to the user's profile if requested
        if (body.saveAddress && body.shippingAddress) {
          const existingAddresses = user.savedAddresses || [];
          const isDuplicate = existingAddresses.some(
            (a) => a.address1 === body.shippingAddress.address1 && a.postalCode === body.shippingAddress.postalCode
          );

          if (!isDuplicate) {
            await updateUser(userId, { savedAddresses: [...existingAddresses, body.shippingAddress] });
          }
        }
      } catch (err) {
        console.warn("Failed to ensure user exists (might be guest or db error):", err);
      }
    }

    const {
      paymentScreenshot,
      isGift,
      giftMessage,
      giftWrap,
      giftNoteColor,
      greetingCard,
      giftWrapFee: _gwf,
      greetingCardFee: _gcf,
      ...orderData
    } = body;

    const gift_details = isGift ? {
      message: giftMessage,
      wrap: giftWrap,
      noteColor: giftNoteColor,
      greetingCard: greetingCard,
      wrapFee: giftWrapFee,
      greetingCardFee: greetingCardFee
    } : null;

    // UPI orders need manual payment verification before processing
    const isUpiOrder = body.paymentMethod === "upi";
    const orderStatus = isUpiOrder ? "payment_verification" : "pending";

    const order = await createOrder({
      id: generateId("order"),
      createdAt: new Date().toISOString(),
      status: orderStatus,
      userId,
      customerPhone,
      paymentScreenshotUrl: screenshotUrl,
      isGift: isGift || false,
      giftDetails: gift_details,
      ...orderData,
    });

    // Increment discount usage if a code was applied
    if (body.discountCode) {
      const discount = await getDiscountByCode(body.discountCode);
      if (discount) {
        await updateDiscount(discount.id, { usedCount: discount.usedCount + 1 });
      }
    }

    // Send Admin Notification Email via Resend
    // Online (PhonePe) orders: skip here — admin email is sent from the payment callback
    // after PhonePe confirms payment, so cancelled/abandoned orders never trigger a notification.
    const isOnlineOrder = body.paymentMethod === "online";
    if (process.env.RESEND_API_KEY && !isOnlineOrder) {
      try {
        const adminSubject = isUpiOrder
          ? `⚠️ Payment Verification Required! #${order.id}`
          : body.isGift 
            ? `🎁 New Gift Order Received! #${order.id}` 
            : `🎉 New Order Received! #${order.id}`;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
          from: `Artisan House Admin <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
            to: [process.env.ADMIN_EMAIL || "artisanhouse.in@gmail.com"],
            subject: adminSubject,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfbf9; padding: 40px 20px; color: #4a3320;">
                <div style="background-color: #ffffff; border: 1px solid #e5dcd3; border-radius: 16px; padding: 40px; box-shadow: 0 8px 24px rgba(74, 51, 32, 0.04);">
                  
                  <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://pub-1f6a6fc4e92548b987db5dbea7cd456e.r2.dev/candle-art-shop-images/Asset/assets-03%20(2).png" alt="Artisan House Logo" style="width: 64px; height: 64px; border-radius: 50%; display: block; margin: 0 auto 12px auto;" />
                    <span style="display: block; font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #4a3320;">Artisan House</span>
                    <span style="display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #b45309; margin-top: 4px;">Candles &middot; Clays &middot; Crafts</span>
                    <h2 style="margin: 24px 0 0 0; color: #4a3320; font-size: 24px; font-weight: bold; border-top: 1px solid #e5dcd3; padding-top: 24px;">${isUpiOrder ? 'Payment Verification Required' : 'New Order Received'}</h2>
                  </div>

                  ${isUpiOrder ? `
                  <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 14px; font-weight: bold; color: #92400e;">⚠️ ACTION REQUIRED: This customer paid via UPI. Please verify their payment before processing the order.</p>
                    ${body.paymentReference ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #78350f;">Transaction ID / UTR: <strong style="font-family: monospace;">${body.paymentReference}</strong></p>` : ''}
                    ${screenshotUrl ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #78350f;"><a href="${screenshotUrl}" target="_blank" style="color: #b45309; font-weight: bold;">View Payment Screenshot →</a></p>` : '<p style="margin: 8px 0 0 0; font-size: 13px; color: #78350f; font-style: italic;">No screenshot uploaded — verify via Transaction ID only.</p>'}
                    ${customerPhone ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #78350f;">Customer phone: <strong>${customerPhone}</strong></p>` : ''}
                  </div>
                  ` : ''}

                  <p style="font-size: 15px; line-height: 1.6; color: #5c4028; margin-bottom: 25px; text-align: center;">
                    ${isUpiOrder ? `<strong>${body.shippingAddress?.fullName}</strong> placed a UPI order. Verify payment and mark as Verified &amp; Process in the admin dashboard.` : `Great news! <strong>${body.shippingAddress?.fullName}</strong> just placed an order.`}
                    ${body.isGift ? `<br><span style="display: inline-block; margin-top: 10px; padding: 4px 12px; background-color: #fef3c7; color: #b45309; border-radius: 9999px; font-size: 12px; font-weight: bold; border: 1px solid #fde68a;">🎁 Gift Order</span>` : ''}
                  </p>

                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Order ID</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600;">#${order.id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Email</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600;"><a href="mailto:${customerEmail}" style="color: #D76E60; text-decoration: none;">${customerEmail}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Payment Method</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600; text-transform: uppercase;">${body.paymentMethod === 'upi' ? 'UPI (Manual Verification)' : body.paymentMethod}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Order Status</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600; text-transform: uppercase; color: ${isUpiOrder ? '#b45309' : '#4a3320'};">${order.status.replace('_', ' ')}</td>
                    </tr>
                  </table>
                  
                  ${body.isGift ? `
                  <div style="background-color: #fdfbf9; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #e5dcd3;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #4a3320; border-bottom: 1px solid #e5dcd3; padding-bottom: 10px;">Gift Details</h3>
                    <div style="font-size: 14px; color: #4a3320; margin-bottom: 6px;"><strong>Premium Gift Wrap:</strong> ${body.giftWrap ? 'Yes (+₹30)' : 'No'}</div>
                    <div style="font-size: 14px; color: #4a3320; margin-bottom: 6px; text-transform: capitalize;"><strong>Greeting Card:</strong> ${body.greetingCard && body.greetingCard !== 'none' ? body.greetingCard + ' (+₹20)' : 'None'}</div>
                    ${body.giftMessage ? `
                    <div style="margin-top: 15px; padding: 15px; background-color: ${body.giftNoteColor || '#fef3c7'}; border-radius: 8px; font-style: italic; color: #4a3320; font-size: 14px; text-align: center; border: 1px solid rgba(0,0,0,0.05);">
                      " ${body.giftMessage} "
                    </div>` : ''}
                  </div>
                  ` : ''}

                  <div style="background-color: #fdfbf9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #4a3320; border-bottom: 1px solid #e5dcd3; padding-bottom: 10px;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                      ${order.items.map((item: any) => `
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; color: #4a3320;">
                            <div style="font-weight: 600; font-size: 15px;">${item.productName}</div>
                            <div style="color: #8c6a50; margin-top: 4px;">Qty: ${item.quantity}</div>
                            ${item.customizations && Object.keys(item.customizations).length > 0 ? 
                              `<div style="color: #8c6a50; font-size: 13px; margin-top: 4px;">${Object.entries(item.customizations).map(([k,v]) => `&bull; ${k}: ${v}`).join('<br>')}</div>` : ''}
                            ${item.giftSet?.picks && item.giftSet.picks.length > 0 ? `
                              <div style="margin-top: 10px; padding: 12px; background-color: #faf7f0; border: 1px solid #eedcc5; border-radius: 8px;">
                                <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; margin-bottom: 6px;">Inside the Box</div>
                                ${item.giftSet.picks.map((pick: any) => `<div style="font-size: 13px; color: #4a3320; margin-bottom: 4px;">&bull; ${pick.name} ${pick.qty > 1 ? `<span style="color: #8c6a50;">&times; ${pick.qty}</span>` : ''}</div>`).join('')}
                                ${item.giftSet.card?.recipient ? `<div style="font-size: 12px; color: #8c6a50; margin-top: 6px; font-style: italic;">Note for: ${item.giftSet.card.recipient}</div>` : ''}
                              </div>
                            ` : ''}
                          </td>
                          <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; text-align: right; font-weight: 600; color: #4a3320; vertical-align: top;">
                            ₹${item.price * item.quantity}
                          </td>
                        </tr>
                      `).join('')}
                      <tr>
                        <td style="padding: 16px 0 8px 0; color: #8c6a50; text-align: right;">Subtotal</td>
                        <td style="padding: 16px 0 8px 0; text-align: right; font-weight: 600; width: 100px;">₹${order.subtotal}</td>
                      </tr>
                      ${order.shipping > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; color: #8c6a50; text-align: right;">Shipping</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600;">₹${order.shipping}</td>
                      </tr>` : ''}
                      ${order.discount > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; color: #8c6a50; text-align: right;">Discount ${order.discountCode ? `(${order.discountCode})` : ''}</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #16a34a;">-₹${order.discount}</td>
                      </tr>` : ''}
                      ${codFee > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; color: #8c6a50; text-align: right;">COD Fee</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600;">₹${codFee}</td>
                      </tr>` : ''}
                      ${giftWrapFee > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; color: #8c6a50; text-align: right;">Gift Wrap</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600;">₹${giftWrapFee}</td>
                      </tr>` : ''}
                      ${greetingCardFee > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; color: #8c6a50; text-align: right;">Greeting Card</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600;">₹${greetingCardFee}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #4a3320; text-align: right;">Total</td>
                        <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #D76E60; text-align: right;">₹${order.total}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center;">
                    <a href="https://artisanhouse.in/admin/orders" target="_blank" style="display: inline-block; background-color: #D76E60; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">View in Admin Dashboard</a>
                    <p style="margin-top: 12px; font-size: 12px; color: #8c6a50;">* For the best experience, please open the admin dashboard on a desktop device.</p>
                  </div>
                </div>
              </div>`,
          }),
        });
        
        if (!emailRes.ok) {
          const errorData = await emailRes.text();
          console.error("[Resend Error]:", emailRes.status, errorData);
        } else {
          console.log("[Resend Success]: Admin email sent for order", order.id);
        }

        // Send Customer Confirmation Email
        // UPI orders: held back until admin verifies payment
        // Online (PhonePe) orders: held back until payment callback confirms success
        // COD orders: confirmed immediately since no upfront payment is needed
        if (body.paymentMethod === "cod" && customerEmail) {
          const customerEmailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: `Artisan House <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
              to: [customerEmail],
              subject: `Order Confirmed: #${order.id} | Artisan House`,
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
                      Hi ${body.shippingAddress.fullName?.split(' ')[0] || 'there'},<br><br>
                      Thank you for your order! We've received it and are getting your handcrafted pieces ready for their journey. We'll send you another update as soon as it ships.
                      ${body.isGift ? `<br><br><span style="display: inline-block; padding: 4px 12px; background-color: #fef3c7; color: #b45309; border-radius: 9999px; font-size: 12px; font-weight: bold; border: 1px solid #fde68a;">🎁 You marked this as a Gift</span>` : ''}
                    </p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                      <tr>
                        <td style="padding: 8px 0; color: #8c6a50;">Order ID</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600;">#${order.id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #8c6a50; vertical-align: top;">Shipping To</td>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600;">
                          ${body.shippingAddress.address1}<br>
                          ${body.shippingAddress.city}, ${body.shippingAddress.state} ${body.shippingAddress.postalCode}
                        </td>
                      </tr>
                    </table>
                    
                    ${body.isGift ? `
                    <div style="background-color: #fdfbf9; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #e5dcd3;">
                      <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #4a3320; border-bottom: 1px solid #e5dcd3; padding-bottom: 10px;">Gift Details</h3>
                      <div style="font-size: 14px; color: #4a3320; margin-bottom: 6px;"><strong>Premium Gift Wrap:</strong> ${body.giftWrap ? 'Yes (+₹30)' : 'No'}</div>
                      <div style="font-size: 14px; color: #4a3320; margin-bottom: 6px; text-transform: capitalize;"><strong>Greeting Card:</strong> ${body.greetingCard && body.greetingCard !== 'none' ? body.greetingCard + ' (+₹20)' : 'None'}</div>
                      ${body.giftMessage ? `
                      <div style="margin-top: 15px; padding: 15px; background-color: ${body.giftNoteColor || '#fef3c7'}; border-radius: 8px; font-style: italic; color: #4a3320; font-size: 14px; text-align: center; border: 1px solid rgba(0,0,0,0.05);">
                        " ${body.giftMessage} "
                      </div>` : ''}
                    </div>
                    ` : ''}

                    <div style="background-color: #fdfbf9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                      <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #4a3320; border-bottom: 1px solid #e5dcd3; padding-bottom: 10px;">Order Summary</h3>
                      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        ${order.items.map((item: any) => `
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; color: #4a3320;">
                              <div style="font-weight: 600; font-size: 15px;">${item.productName}</div>
                              <div style="color: #8c6a50; margin-top: 4px;">Qty: ${item.quantity}</div>
                              ${item.customizations && Object.keys(item.customizations).length > 0 ? 
                                `<div style="color: #8c6a50; font-size: 13px; margin-top: 4px;">${Object.entries(item.customizations).map(([k,v]) => `&bull; ${k}: ${v}`).join('<br>')}</div>` : ''}
                              ${item.giftSet?.picks && item.giftSet.picks.length > 0 ? `
                                <div style="margin-top: 10px; padding: 12px; background-color: #faf7f0; border: 1px solid #eedcc5; border-radius: 8px;">
                                  <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; margin-bottom: 6px;">Inside the Box</div>
                                  ${item.giftSet.picks.map((pick: any) => `<div style="font-size: 13px; color: #4a3320; margin-bottom: 4px;">&bull; ${pick.name} ${pick.qty > 1 ? `<span style="color: #8c6a50;">&times; ${pick.qty}</span>` : ''}</div>`).join('')}
                                  ${item.giftSet.card?.recipient ? `<div style="font-size: 12px; color: #8c6a50; margin-top: 6px; font-style: italic;">Note for: ${item.giftSet.card.recipient}</div>` : ''}
                                </div>
                              ` : ''}
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5dcd3; text-align: right; font-weight: 600; color: #4a3320; vertical-align: top;">
                              ₹${item.price * item.quantity}
                            </td>
                          </tr>
                        `).join('')}
                        <tr>
                          <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #4a3320; text-align: right;">Total</td>
                          <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #D76E60; text-align: right;">₹${order.total}</td>
                        </tr>
                      </table>
                    </div>

                    <div style="text-align: center;">
                      <a href="https://artisanhouse.in/order/${order.id}" target="_blank" style="display: inline-block; background-color: #D76E60; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">View Order Status</a>
                    </div>
                  </div>
                </div>`,
            }),
          });
          
          if (!customerEmailRes.ok) {
            console.error("[Resend Error]: Customer email failed", await customerEmailRes.text());
          } else {
            console.log("[Resend Success]: Customer email sent to", customerEmail);
          }
        }
      } catch (emailErr) {
        console.error("Failed to send notification emails:", emailErr);
      }
    } else {
      console.warn("[Resend Warning]: RESEND_API_KEY is missing. Skipping admin email.");
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("[Order Creation Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
