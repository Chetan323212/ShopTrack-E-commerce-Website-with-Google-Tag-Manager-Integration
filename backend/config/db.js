import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/aura_ecommerce";

  try {
    // Attempt standard connection with 2.5s timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    return conn;
  } catch (err) {
    console.warn(`\x1b[33m⚠ External MongoDB connection failed (${err.message}).\x1b[0m`);
    console.log(`\x1b[36mℹ Initializing embedded MongoDB memory instance for zero-config local development...\x1b[0m`);

    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();

      const conn = await mongoose.connect(inMemoryUri);
      console.log(`\x1b[32m✔ Embedded MongoDB In-Memory Server Active at: ${inMemoryUri}\x1b[0m`);
      return conn;
    } catch (memErr) {
      console.error(`\x1b[31m✖ Failed to initialize embedded MongoDB: ${memErr.message}\x1b[0m`);
      throw memErr;
    }
  }
};
