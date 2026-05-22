export default function AboutPage() {
  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Our Story
          </p>

          <h1 className="text-5xl font-bold mt-4">
            About Beauty Luxe
          </h1>

          <p className="text-gray-600 mt-6 max-w-3xl mx-auto leading-8">
            Beauty Luxe was created to bring premium skincare, luxury makeup,
            and signature fragrances to modern beauty lovers. We believe beauty
            should feel elegant, authentic, and empowering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
            alt="Beauty Luxe"
            className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
          />

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Luxury Meets Everyday Beauty
            </h2>

            <p className="text-gray-600 leading-8 mb-6">
              From iconic beauty essentials to carefully curated skincare,
              Beauty Luxe brings products that elevate your daily routine.
            </p>

            <p className="text-gray-600 leading-8 mb-6">
              Every product is selected with quality, authenticity, and beauty
              innovation in mind.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="bg-white shadow rounded-2xl p-6 text-center">
                <h3 className="text-3xl font-bold">500+</h3>
                <p className="text-gray-500 mt-2">
                  Premium Products
                </p>
              </div>

              <div className="bg-white shadow rounded-2xl p-6 text-center">
                <h3 className="text-3xl font-bold">10K+</h3>
                <p className="text-gray-500 mt-2">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}