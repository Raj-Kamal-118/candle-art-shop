export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="prose prose-lg prose-amber dark:prose-invert mx-auto">
        <h1 className="font-serif text-center">Shipping Policy</h1>

        <h2>Processing Times</h2>
        <p>
          Because many of our products are hand-poured or made-to-order, please
          allow <strong>2 to 4 business days</strong> for your order to be
          processed and crafted before it is shipped.
        </p>
        <p>
          For custom artwork and personalized magnets, processing times may take
          up to <strong>7 business days</strong> depending on the complexity of
          the request.
        </p>

        <h2>Shipping Rates & Delivery Times</h2>
        <ul>
          <li>
            <strong>Standard Shipping (5-7 business days):</strong> ₹99
          </li>
          <li>
            <strong>Express Shipping (2-3 business days):</strong> ₹199
          </li>
          <li>
            <strong>Free Standard Shipping:</strong> On all orders over ₹999
          </li>
        </ul>
        <p>
          <em>
            Note: Delivery times are estimates and commence from the date of
            shipping, rather than the date of order.
          </em>
        </p>

        <h2>Order Tracking</h2>
        <p>
          Once your order has been dispatched, you will receive a confirmation
          email containing your tracking number. You can also track your order
          directly from your Account page.
        </p>

        <h2>Damages During Transit</h2>
        <p>
          Candles are delicate. While we package everything with extreme care
          and protective materials, accidents in transit can occasionally
          happen. If your item arrives damaged, please contact us within 48
          hours of delivery with a photo of the damaged item and packaging, and
          we will arrange a replacement immediately.
        </p>
      </div>
    </div>
  );
}
