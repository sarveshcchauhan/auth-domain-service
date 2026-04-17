import http from "http";
import app from "./app";
import { ENV } from "./config/env";

import { connectMongo } from "./infrastructure/database/mongo.connection";
import { connectRedis } from "./infrastructure/cache/redis.client";
import { startConsumer } from "./infrastructure/kafka/consumer/consumer";
import { startTracing } from "./infrastructure/observability/tracer";
import { connectProducer } from "./infrastructure/kafka/producer";
import { outboxWorker } from "./workers/outbox.worker";

let server: http.Server;

/**
 * Bootstrap core dependencies first
 */
const initCoreServices = async () => {
  await connectMongo();
  await connectRedis();
  await startTracing();
};

/**
 * Start Kafka layer separately (non-blocking)
 */
const initMessagingLayer = async () => {
  try {
    await connectProducer();
    await startConsumer();

    console.log("Kafka Consumer + Producer initialized");
    
    await outboxWorker();
  } catch (err) {
    console.error("Kafka initialization failed:", err);

    // IMPORTANT:
    // Don't kill API if Kafka is down
    // System should still run (eventual consistency model)
  }
};

/**
 * Start HTTP server
 */
const startHttpServer = () => {
  server = app.listen(4000, () => {
    console.log(`${ENV.NODE_ENV} Auth Service running on port 4000`);
  });
};

/**
 * Graceful shutdown handler
 */
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  try {
    if (server) {
      server.close(() => {
        console.log("HTTP server closed");
      });
    }

    // Close the connection :
    // await consumer.disconnect();
    // await producer.disconnect();
    // await redisClient.quit();
    // await mongoose.disconnect();

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

/**
 * Main bootstrap function
 */
const startServer = async () => {
  try {
    // 1. Core infra (must succeed)
    await initCoreServices();

    // 2. Start HTTP immediately
    startHttpServer();

    // 3. Kafka async (non-blocking)
    initMessagingLayer();

  } catch (err) {
    console.error("Startup Failed:", err);
    process.exit(1);
  }
};

/**
 * Process lifecycle hooks
 */
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();