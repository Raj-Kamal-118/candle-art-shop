export default function FAQPage() {
  const faqs = [
    {
      q: "What kind of wax do you use?",
      a: "We primarily use a premium blend of natural soy wax and pure beeswax. These natural waxes ensure a cleaner, longer burn without the harmful toxins often found in paraffin candles.",
    },
    {
      q: "How long will my candle burn?",
      a: "Burn times vary depending on the size of the candle. Our standard 8oz jar candles burn for approximately 40-50 hours, while larger pillars can burn for up to 80 hours.",
    },
    {
      q: "Do you take custom orders?",
      a: "Yes! We love creating custom pieces for weddings, corporate gifts, or special occasions. You can visit our Custom Artwork page or contact us directly to discuss your vision.",
    },
    {
      q: "Why is my candle tunneling?",
      a: "Tunneling happens when a candle isn't burned long enough on its first light. Always ensure the melt pool reaches the edges of the vessel during the first burn (usually 2-3 hours) to prevent this.",
    },
    {
      q: "Are your fragrances safe?",
      a: "Absolutely. We strictly use phthalate-free fragrance oils and pure essential oils. All our scents adhere to strict safety standards.",
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship within India. We are working hard to expand our shipping capabilities to international customers soon!",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-brown-600 dark:text-amber-200/70">
          Everything you need to know about our products.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1a1830] p-6 rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30"
          >
            <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-2">
              {faq.q}
            </h3>
            <p className="text-brown-600 dark:text-amber-200/70 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
