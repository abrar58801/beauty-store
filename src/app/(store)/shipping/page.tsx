export default function ShippingPage() {
  return (
    <main className="bg-gradient-to-b from-white to-pink-50 min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Policy
          </p>

          <h1 className="text-5xl font-bold mt-4">
            Shipping Policy
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-10 space-y-8 text-gray-600">
          <div>
            <h2 className="text-2xl font-bold text-black mb-3">
              Processing Time
            </h2>

            <p>
              Orders are processed within 24–48 hours after payment confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-3">
              Delivery Time
            </h2>

            <p>
              Delivery typically takes 3–7 business days across India.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-3">
              Shipping Charges
            </h2>

            <p>
              Free shipping on orders above ₹999.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-3">
              Order Tracking
            </h2>

            <p>
              Tracking details will be shared via email after shipment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}