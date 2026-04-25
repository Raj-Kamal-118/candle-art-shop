import { NextRequest, NextResponse } from "next/server";
import {
  getOrders,
  createOrder,
  updateDiscount,
  getDiscountByCode,
  hasUserUsedDiscount,
  getUserById,
  createUser
} from "@/lib/data";
import { generateId } from "@/lib/utils";

export async function GET() {
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

    // Derive customerPhone from shipping address or explicit field
    const customerPhone =
      body.customerPhone ||
      body.shippingAddress?.phone ||
      undefined;

    const codFee = body.codFee || 0;

    // Prevent total mismatch / payload tampering
    const expectedTotal = body.subtotal - body.discount + body.shipping + codFee;
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
      if ((discount as any).oneUsePerCustomer) {
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
        const existingUser = await getUserById(userId);
        if (!existingUser) {
          await createUser({
            id: userId,
            phone: customerPhone || body.shippingAddress?.phone || "",
            name: body.shippingAddress?.fullName,
            email: body.shippingAddress?.email,
          });
        }
      } catch (err) {
        console.warn("Failed to ensure user exists (might be guest or db error):", err);
      }
    }

    const order = await createOrder({
      id: generateId("order"),
      createdAt: new Date().toISOString(),
      status: "pending",
      userId,
      customerPhone,
      ...body,
    });

    // Increment discount usage if a code was applied
    if (body.discountCode) {
      const discount = await getDiscountByCode(body.discountCode);
      if (discount) {
        await updateDiscount(discount.id, { usedCount: discount.usedCount + 1 });
      }
    }

    // Send Admin Notification Email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
          from: `Artisan House Admin <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
            to: [process.env.ADMIN_EMAIL || "rkcse118@gmail.com"],
            subject: `🎉 New Order Received! #${order.id}`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfbf9; padding: 40px 20px; color: #4a3320;">
                <div style="background-color: #ffffff; border: 1px solid #e5dcd3; border-radius: 16px; padding: 40px; box-shadow: 0 8px 24px rgba(74, 51, 32, 0.04);">
                  
                  <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://pub-1f6a6fc4e92548b987db5dbea7cd456e.r2.dev/candle-art-shop-images/Asset/assets-03%20(2).png" alt="Artisan House Logo" style="width: 64px; height: 64px; border-radius: 50%; display: block; margin: 0 auto 12px auto;" />
                    <span style="display: block; font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #4a3320;">Artisan House</span>
                    <span style="display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #b45309; margin-top: 4px;">Candles &middot; Clays &middot; Crafts</span>
                    <h2 style="margin: 24px 0 0 0; color: #4a3320; font-size: 24px; font-weight: bold; border-top: 1px solid #e5dcd3; padding-top: 24px;">New Order Received</h2>
                  </div>
                  
                  <p style="font-size: 15px; line-height: 1.6; color: #5c4028; margin-bottom: 25px; text-align: center;">
                    Great news! <strong>${body.shippingAddress?.fullName}</strong> just placed an order.
                  </p>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 15px;">
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Order ID</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600;">#${order.id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Email</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600;"><a href="mailto:${body.shippingAddress?.email}" style="color: #D76E60; text-decoration: none;">${body.shippingAddress?.email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #8c6a50;">Payment Method</td>
                      <td style="padding: 8px 0; text-align: right; font-weight: 600; text-transform: uppercase;">${body.paymentMethod}</td>
                    </tr>
                  </table>
                  
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
        if (body.shippingAddress?.email) {
          const customerEmailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: `Artisan House <${process.env.STORE_EMAIL || "orders@artisanhouse.in"}>`,
              to: [body.shippingAddress.email],
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
            console.log("[Resend Success]: Customer email sent to", body.shippingAddress.email);
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
