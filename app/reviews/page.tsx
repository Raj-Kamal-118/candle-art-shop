import { getApprovedReviews } from "@/lib/reviews";
import SecondaryHeader from "@/components/layout/SecondaryHeader";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ What our customers say ✦"
        titlePrefix="Stories of"
        titleHighlighted="Warmth"
        description="Read what our wonderful customers have to say about their experiences with our handcrafted pieces."
      />
      <ReviewsClient initialReviews={reviews} />
    </main>
  );
}
