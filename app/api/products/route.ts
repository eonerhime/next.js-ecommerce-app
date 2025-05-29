// app/api/products/route.ts
import { connectToDb } from "../db";

export async function GET() {
  try {
    const { db } = await connectToDb();

    const products = await db.collection("products").find({}).toArray();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Database error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
