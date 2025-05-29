import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";

interface Cart {
  userId: string;
  cartIds: string[];
}

type Params = {
  id: string;
};

// Keep track of the cart for multiple users
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id: userId } = params;

  const { db } = await connectToDb();
  const userCart = await db.collection("carts").findOne({ userId });

  // If the user has no products in the cart, return an empty array
  if (!userCart) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const cartIds = userCart.cartIds;
  // If the user has products in the cart, find them in the products list
  const cartProducts = await db
    .collection("products")
    .find({ id: { $in: cartIds } })
    .toArray();

  return new Response(JSON.stringify(cartProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

type CartBody = {
  productId: string;
};

// Add a product to the user's cart
// If the user does not have a cart, create one
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { db } = await connectToDb();
  const userId = params.id;
  const body: CartBody = await request.json();
  const productId = body.productId;

  const updatedCart = await db
    .collection<Cart>("carts")
    .findOneAndUpdate(
      { userId },
      { $push: { cartIds: productId } },
      { upsert: true, returnDocument: "after" }
    );

  const cartProducts = await db
    .collection("products")
    .find({ id: { $in: updatedCart?.cartIds } })
    .toArray();

  return new Response(JSON.stringify(cartProducts), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Remove a product from the user's cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { db } = await connectToDb();
  const userId = params.id;
  const body: CartBody = await request.json();
  const productId = body.productId;

  // Remove the product from the user's cart
  const updatedCart = await db
    .collection<Cart>("carts")
    .findOneAndUpdate(
      { userId },
      { $pull: { cartIds: productId } },
      { returnDocument: "after" }
    );

  // If the product was not found in the cart, return an error
  if (!updatedCart) {
    return new Response(JSON.stringify(JSON.stringify([])), {
      status: 202,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // If the product was successfully removed, return the updated cart
  // Fetch the updated cart products
  const cartProducts = await db
    .collection("products")
    .find({ id: { $in: updatedCart.cartIds } })
    .toArray();

  return new Response(JSON.stringify(cartProducts), {
    status: 202,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
