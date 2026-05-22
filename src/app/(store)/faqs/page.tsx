const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Orders are delivered within 3–7 business days depending on location.",
  },
  {
    question: "Do you offer returns?",
    answer:
      "Yes, returns are accepted within 7 days for unused products.",
  },
  {
    question: "Are your products authentic?",
    answer:
      "Yes, all products are 100% original and sourced directly from brands.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Orders can be cancelled before shipment.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Support
          </p>

          <h1 className="text-5xl font-bold mt-4">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-pink-50 rounded-3xl p-8"
            >
              <h2 className="text-xl font-bold">
                {faq.question}
              </h2>

              <p className="text-gray-600 mt-3">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}