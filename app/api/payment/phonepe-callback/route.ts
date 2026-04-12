import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // PhonePe redirects using a form POST request based on the redirectMode: "POST" instruction
    const formData = await req.formData();
    const code = formData.get("code");
    const transactionId = formData.get("transactionId");
    const providerReferenceId = formData.get("providerReferenceId");
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (code === "PAYMENT_SUCCESS") {
      // Fire-and-forget: Tell our own API to update the DB order status to processing 
      // (this corresponds to your existing setup in AdminOrdersPage)
      try {
        await fetch(`${appUrl}/api/orders/${transactionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            status: "processing", 
            paymentReference: providerReferenceId 
          }) 
        });
      } catch (e) {
        console.error("Failed to sync order status:", e);
      }

      // Send user safely back to success Checkout Page Step
      return NextResponse.redirect(`${appUrl}/checkout?order=${transactionId}&status=SUCCESS&ref=${providerReferenceId || ""}`, 303);
    } 
    
    return NextResponse.redirect(`${appUrl}/checkout?order=${transactionId}&status=FAILED`, 303);
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?status=FAILED`, 303);
  }
}