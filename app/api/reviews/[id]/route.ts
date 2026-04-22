import { NextResponse } from "next/server";
import { getReviewById } from "@/lib/reviews";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const review = await getReviewById(params.id);
    if (!review) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
  }
}
