import { Metadata } from "next";
import {
  Building2,
  Eye,
  Lock,
  Share2,
  ShoppingBag,
  Cookie,
  ShieldCheck,
  Archive,
  UserCheck,
  ExternalLink,
  RefreshCw,
  Phone,
} from "lucide-react";
import InformationalLayout from "@/components/layout/InformationalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Artisan House collects, uses, stores, and protects your information when you visit artisanhouse.in.",
};

const sections = [
  {
    Icon: Building2,
    heading: "Business Information",
    body: `<p><strong>Business Name:</strong> Artisan House<br/>
<strong>Managed By:</strong> Shreya Rastogi<br/>
<strong>Registered Address:</strong> K 7/20, Machodri, Shivpur, Lalasur Ki Galli, Varanasi, Uttar Pradesh – 221001, India<br/>
📞 <a href="tel:+919519486785" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">+91 95194 86785</a><br/>
📧 <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a><br/>
🌐 <a href="https://www.artisanhouse.in" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">www.artisanhouse.in</a></p>`,
  },
  {
    Icon: Eye,
    heading: "Information We Collect",
    body: `<p><strong>Personal Information:</strong> We may collect your full name, phone number, email address, billing and shipping address, order details, and customer support communications.</p>
<p><strong>Payment Information:</strong> Payments are processed through secure third-party payment gateways. We do not store debit/credit card numbers, CVV, UPI PIN, or banking credentials.</p>
<p><strong>Technical Information:</strong> When you use our Website, we may collect your IP address, device information, browser type, pages visited, cookies, and analytics data.</p>`,
  },
  {
    Icon: Lock,
    heading: "How We Use Your Information",
    body: `<p>We use your information to:</p>
<ul class="list-disc pl-5 space-y-1 mt-2">
  <li>Process and fulfill orders</li>
  <li>Deliver products and services</li>
  <li>Provide customer support</li>
  <li>Send order updates via email and WhatsApp</li>
  <li>Improve our Website and customer experience</li>
  <li>Prevent fraud or misuse</li>
  <li>Maintain records and comply with legal obligations</li>
</ul>`,
  },
  {
    Icon: Share2,
    heading: "Sharing of Information",
    body: `<p>We do not sell or rent your personal information. We may share information only with:</p>
<ul class="list-disc pl-5 space-y-1 mt-2">
  <li>Courier and logistics partners (for order fulfillment)</li>
  <li>Payment gateway providers</li>
  <li>Hosting and IT service providers</li>
  <li>Legal or government authorities when required by law</li>
</ul>
<p>Only the minimum necessary information is shared for order fulfillment.</p>`,
  },
  {
    Icon: ShoppingBag,
    heading: "Handmade Product Disclaimer",
    body: `<p>As our products are handmade or artisan-crafted, minor variations in color, texture, size, or finish may occur. Such variations are natural characteristics of handmade products and are not defects.</p>`,
  },
  {
    Icon: Cookie,
    heading: "Cookies Policy",
    body: `<p>Our Website may use cookies to improve user experience, analyze traffic, store customer preferences, and enhance Website functionality. You may disable cookies through your browser settings.</p>`,
  },
  {
    Icon: ShieldCheck,
    heading: "Data Security",
    body: `<p>We implement reasonable technical and administrative measures to protect your personal data from unauthorized access, disclosure, loss, or misuse. However, no online system can guarantee complete security.</p>`,
  },
  {
    Icon: Archive,
    heading: "Data Retention",
    body: `<p>We retain your information as necessary for order processing, customer support, billing and accounting, legal compliance, and internal records. You may request deletion of your data by contacting us at <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a>.</p>`,
  },
  {
    Icon: UserCheck,
    heading: "Your Rights",
    body: `<p>You may request access to, correction of, or deletion of your personal data (subject to legal obligations) by emailing us at <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a>.</p>`,
  },
  {
    Icon: ExternalLink,
    heading: "Third-Party Links",
    body: `<p>We are not responsible for the privacy practices of third-party websites linked on our Website. Please review their privacy policies before sharing any information.</p>`,
  },
  {
    Icon: RefreshCw,
    heading: "Changes to This Policy",
    body: `<p>We reserve the right to update this Privacy Policy at any time. We will notify you of significant changes as required under applicable laws. Please check this page periodically for updates.</p>`,
  },
  {
    Icon: Phone,
    heading: "Contact Us",
    body: `<p>For any privacy-related queries or data requests:<br/>
📞 <a href="tel:+919519486785" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">+91 95194 86785</a><br/>
📧 <a href="mailto:artisanhouse.in@gmail.com" class="text-coral-700 dark:text-coral-400 font-semibold hover:underline">artisanhouse.in@gmail.com</a></p>`,
  },
];

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <InformationalLayout
      eyebrow="✦ Privacy Policy ✦"
      titlePrefix="Handled with"
      titleHighlighted="care"
      description="This Privacy Policy explains how Artisan House collects, uses, stores, and protects your information when you visit artisanhouse.in or purchase our products."
      lastUpdated={lastUpdated}
      sections={sections}
    />
  );
}
