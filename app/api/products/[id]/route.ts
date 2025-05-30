import { NextRequest } from "next/server";
import { connectToDb } from "../../db";

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { db } = await connectToDb();
    const productId = params.id;
    const products = await db.collection("products").findOne({ id: productId });

    // If the product is found, return it
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    // Always return JSON, even on error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return Response.json(
      { error: "Failed to fetch products", details: errorMessage },
      { status: 500 }
    );
  }
}
