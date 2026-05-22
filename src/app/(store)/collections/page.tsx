import Link from "next/link";

const collections = [
  {
    name: "Makeup",
    slug: "makeup",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    name: "Skincare",
    slug: "skincare",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f",
  },
];

export default function CollectionsPage() {
  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-pink-500 uppercase tracking-[0.3em] text-sm">
            Beauty Collections
          </p>

          <h1 className="text-5xl font-bold mt-4">
            Shop By Collection
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="bg-white rounded-3xl shadow hover:shadow-xl overflow-hidden transition"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-96 object-cover"
              />

              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold">
                  {collection.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}