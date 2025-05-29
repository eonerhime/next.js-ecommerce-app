import { MongoClient, Db, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDb() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const user = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  // Check if credentials exist
  if (!user || !password) {
    throw new Error("MongoDB credentials not found in environment variables");
  }

  // URL encode the password to handle special characters
  const encodedPassword = encodeURIComponent(password);
  const uri = `mongodb+srv://${user}:${encodedPassword}@cluster0.j8gvg35.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    cachedClient = client;
    cachedDb = client.db("ecommerce-nextjs");

    return { client, db: cachedDb };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
