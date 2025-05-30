import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-default shadow-md">
      <div className="container mx-auto px-4 py-3 justify-between items-center">
        <ul className="flex justify-end space-x-4 text-default">
          <li>
            <Link href="/" className=" hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-gray-400">
              Products
            </Link>
          </li>
          <li>
            <Link href="/cart" className="hover:text-gray-400">
              Cart
            </Link>
          </li>
          <li>
            <Link href="/checkout" className="hover:text-gray-400">
              Checkout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
