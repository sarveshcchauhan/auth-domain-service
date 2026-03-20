import mongoose from "mongoose";
import { ENV } from "../../config/env";

/**
 * Connects to MongoDB using mongoose.
 * Uses connection pooling automatically.
 */
export const connectMongo = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

// Production Mongo should run as: Replica Set for failover.