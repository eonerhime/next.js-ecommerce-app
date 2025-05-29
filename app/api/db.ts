import { MongoClient, Db, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDb() {
  if (cachedClient && cachedDb) {
    try {
      // Test the connection
      await cachedClient.db("admin").command({ ping: 1 });
      console.log("Using cached database connection");
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.log("Cached connection is stale, creating new connection");
      // Clear the cache if connection is dead
      cachedClient = null;
      cachedDb = null;
    }
  }

  const user = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  // Check if credentials exist
  if (!user || !password) {
    throw new Error("MongoDB credentials not found in environment variables");
  }

  // Validate the credentials
  const uri = `${process.env.MONGODB_URI}`;

  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("Creating new MongoDB connection");
    await client.connect();

    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB");

    cachedClient = client;
    cachedDb = client.db("ecommerce-nextjs");

    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
