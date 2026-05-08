import { Metadata } from "next";
import {
  RefreshCw,
  Ban,
  AlertCircle,
  EyeOff,
  ShieldCheck,
  Clock,
} from "lucide-react";
import InformationalLayout from "@/components/layout/InformationalLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Learn about our refund, cancellation, and exchange processes at Artisan House.",
};

const sections = [
  {
    Icon: RefreshCw,
    heading: "Refund and Cancellation Policy",
    body: "<p>This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform.</p><p>Under this policy: Cancellations will only be considered if the request is made 7 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.</p>",
  },
  {
    Icon: Ban,
    heading: "Perishable Items",
    body: "<p>Artisan House does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.</p>",
  },
  {
    Icon: AlertCircle,
    heading: "Damaged or Defective Items",
    body: "<p>In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 7 days of receipt of products.</p>",
  },
  {
    Icon: EyeOff,
    heading: "Not As Expected",
    body: "<p>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.</p>",
  },
  {
    Icon: ShieldCheck,
    heading: "Warranties",
    body: "<p>In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.</p>",
  },
  {
    Icon: Clock,
    heading: "Refund Processing",
    body: "<p>In case of any refunds approved by Artisan House, it will take 4 days for the refund to be processed to you.</p>",
  },
];

export default function RefundPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <InformationalLayout
      eyebrow="✦ Refund Policy ✦"
      titlePrefix="Fair and"
      titleHighlighted="transparent"
      description="Everything you need to know about processing cancellations, refunds, and timelines."
      lastUpdated={lastUpdated}
      sections={sections}
    />
  );
}
