import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-2 overflow-hidden">
      <main className="text-center space-y-4 max-w-xl">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            The <span className="italic">Inspirit</span> Ecommerce Ankh
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Discover our curated collection of premium products
          </p>
        </header>

        <div className="bg-white p-3 rounded-lg shadow-md">
          <p className="text-gray-700 text-sm mb-2">
            Ready to explore our products?
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 hover:shadow-lg text-sm"
          >
            View All Products
          </Link>
        </div>
      </main>
    </div>
  );
}
