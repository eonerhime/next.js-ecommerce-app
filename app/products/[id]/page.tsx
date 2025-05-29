import NotFoundPage from "@/app/not-found";
import Image from "next/image";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const res = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + `/api/products/${id}`
  );
  const product = await res.json();

  console.log("Product:", product);

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8">
      <div className="h-96 md:w-1/2 mb-4 md:mb-0 md:mr-8 relative">
        <Image
          fill
          src={`/${product.imageUrl}`}
          alt={product.name}
          quality={80}
          className="object-cover rounded-md"
        />
      </div>

      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-gray-600 mb-6">${product.price}</p>
        <h3 className="text-2xl font-semibold mb-2">Description</h3>
        <h3 className="text-gray-700">{product.description}</h3>
      </div>
    </div>
  );
}
