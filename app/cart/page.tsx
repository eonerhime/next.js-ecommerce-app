import ShoppingCartList from "./ShoppingCartList";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/2/cart`,
    {
      cache: "no-cache",
    }
  );
  const cartProducts = await res.json();

  return <ShoppingCartList initialCartProducts={cartProducts} />;
}
