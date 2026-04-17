/**
 * Entry point for Kafka consumer lifecycle.
 *
 * Responsibilities:
 * - Connect to Kafka
 * - Subscribe to required topics
 * - Start message consumption loop
 *
 * This file intentionally contains minimal logic.
 */
import { consumer } from "..";
import { handleMessage } from "../../../interfaces/kafka/message.handler";
import { TOPICS } from "../topics";

/**
 * Starts the Kafka consumer.
 *
 * Flow:
 * 1. Connect to Kafka broker
 * 2. Subscribe to topics
 * 3. Begin consuming messages
 */
export const startConsumer = async () => {
  try {
    await consumer.connect();

    await consumer.subscribe({
      topic: TOPICS.USER_EVENTS,
      fromBeginning: false,
    });
    console.log("Subscribed to:", TOPICS.USER_EVENTS);

    await consumer.run({
      eachMessage: async (payload) => {
        return handleMessage(payload);
      },
    });
  } catch (err) {
    console.error("Consumer failed:", err);
    throw err;
  }
};
