import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      order_id,
      customer_name,
      location,
      title,
      rating,
      text,
      images,
      product_id,
      product_name,
      product_reviews,
    } = body;

    if (!customer_name || !rating || !text) {
      return NextResponse.json(
        { error: "Name, rating, and text are required." },
        { status: 400 }
      );
    }

    // 1. Insert the main review
    const { data: mainReview, error: mainError } = await supabase
      .from("reviews")
      .insert({
        id: generateId("rev"),
        order_id,
        customer_name,
        location,
        title,
        rating,
        text,
        images,
        product_id,
        product_name,
      })
      .select()
      .single();

    if (mainError) {
      console.error("Error inserting main review:", mainError);
      return NextResponse.json({ error: mainError.message }, { status: 500 });
    }

    // 2. Insert specific product reviews if the user expanded and rated them
    if (product_reviews && Array.isArray(product_reviews) && product_reviews.length > 0) {
      const specificReviews = product_reviews.map((pr: any) => ({
        id: generateId("rev"),
        order_id,
        customer_name,
        location,
        title: pr.product_name ? `Review for ${pr.product_name}` : title,
        rating: pr.rating,
        text: pr.text,
        images: [],
        product_id: pr.product_id,
        product_name: pr.product_name,
      }));

      const { error: specificError } = await supabase
        .from("reviews")
        .insert(specificReviews);

      if (specificError) {
        console.error("Error inserting specific reviews:", specificError);
      }
    }

    // 3. Mark the order as reviewed if it exists
    if (order_id) {
      await supabase
        .from("orders")
        .update({ is_reviewed: true })
        .eq("id", order_id);
    }

    return NextResponse.json({ success: true, review: mainReview });
  } catch (error: any) {
    console.error("Review Submission API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}