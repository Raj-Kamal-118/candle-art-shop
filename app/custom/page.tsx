import { Metadata } from "next";
import CustomTrio from "@/components/home/CustomTrio";

export const metadata: Metadata = {
  title: "Bespoke Creations",
  description:
    "Design your perfect custom candle, hand-painted magnet, or curated gift set. Bespoke creations, handcrafted just for you at Artisan House.",
};

export default function CustomPage() {
  return (
    <div className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612]">
      <CustomTrio />
    </div>
  );
}
