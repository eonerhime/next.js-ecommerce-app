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

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const database = process.env.MONGODB_DATABASE || "ecommerce-nextjs";

  // Simplified connection string - remove conflicting TLS options
  const uri = `mongodb+srv://${username}:${password}@cluster0.j8gvg35.mongodb.net/${database}?retryWrites=true&w=majority`;

  try {
    const client = new MongoClient(uri, {
      // Use only client options for TLS
      tls: true,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 20000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
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
