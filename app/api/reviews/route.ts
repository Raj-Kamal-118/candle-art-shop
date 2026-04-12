import { NextResponse } from "next/server";
import { supabase } from "@/lib/reviews";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, product_name, customer_name, location, rating, text, image_url } = body;

    const id = `rev-${Date.now()}`;

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          id,
          order_id,
          product_name,
          customer_name,
          location,
          rating,
          text,
          image_url,
          approved: false, // All submissions require manual admin approval
        },
      ])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
