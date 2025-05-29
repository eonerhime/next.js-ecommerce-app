"use client";

// import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "../product-data";
import { useRouter } from "next/navigation";

export default function ShoppingCartList({
  initialCartProducts,
}: {
  initialCartProducts: Product[];
}) {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);
  const router = useRouter();

  async function removeFromCart(productId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + "/api/users/2/cart",
      {
        method: "DELETE",

        body: JSON.stringify({
          productId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      router.refresh(); // Refreshes server components
    }
    const updatedCartProducts = await response.json();
    setCartProducts(updatedCartProducts);
  }

  function productIsInCart(productId: string) {
    return cartProducts.some((product) => product.id === productId);
  }

  return (
    <>
      <div className="grid grid-row-1 gap-8 p-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        {cartProducts.map((product) => (
          <Link
            href={`products/${product.id}`}
            key={product.id}
            className="border bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 flex justify-between items-start"
          >
            <div>
              {/* <div className="flex justify-center mb-4 h-48 relative">
              <Image
                width={32}
                height={32}
                src={`/${product.imageUrl}`}
                alt={product.name}
                quality={80}
                className="object-cover rounded-md"
              />
            </div> */}
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              {/* <p>{product.description}</p> */}
            </div>
            <div>
              {productIsInCart(product.id) ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(product.id);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                >
                  Remove from Cart
                </button>
              ) : (
                ""
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
