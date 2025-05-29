import ProductsList from "./ProductsList";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function ProductPage() {
  // Fetching products from the API
  // This is cached to avoid unnecessary re-fetching on every render
  const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL + "/api/products", {
    cache: "no-cache",
  });
  const products = await res.json();

  // Fetching cart products for active user
  const res2 = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + "/api/users/2/cart",
    {
      cache: "no-cache",
    }
  );
  const cartProducts = await res2.json();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <ProductsList products={products} initialCartProducts={cartProducts} />
    </div>
  );
}
