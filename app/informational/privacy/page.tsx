export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="prose prose-lg prose-amber dark:prose-invert mx-auto">
        <h1 className="font-serif text-center">Privacy Policy</h1>
        <p className="text-center text-sm">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you visit the Candle Art Shop, we collect certain information
          about your device, your interaction with the site, and information
          necessary to process your purchases. We may also collect additional
          information if you contact us for customer support.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>
            <strong>Providing Products & Services:</strong> To process your
            payments, arrange shipping, and provide you with invoices and/or
            order confirmations.
          </li>
          <li>
            <strong>Communication:</strong> To communicate with you regarding
            your orders or answer your queries.
          </li>
          <li>
            <strong>Site Optimization:</strong> To screen our orders for
            potential risk or fraud, and to improve and optimize our Site.
          </li>
        </ul>

        <h2>Sharing Personal Information</h2>
        <p>
          We share your Personal Information with service providers to help us
          provide our services and fulfill our contracts with you, such as
          payment processors (e.g., Razorpay/Stripe) and shipping partners. We
          do not sell your personal data to third parties.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to access personal information we hold about you
          and to ask that your personal information be corrected, updated, or
          deleted. If you would like to exercise this right, please contact us
          through the Contact page.
        </p>

        <h2>Data Retention</h2>
        <p>
          When you place an order through the Site, we will retain your Personal
          Information for our records unless and until you ask us to erase this
          information.
        </p>
      </div>
    </div>
  );
}
