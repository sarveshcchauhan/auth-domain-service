import { Kafka } from "kafkajs";
import { ENV } from "../../config/env";


const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

const kafka = new Kafka({
  clientId: "data-service",
  brokers: [ENV.KAFKA_BROKER || "auth-kafka:9092"],
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  let retries = 10;

  while (retries > 0) {
    try {
      await producer.connect();
      console.log("Kafka Producer Connected");
      return;
    } catch (err) {
      console.log("Kafka not ready, retrying...");
      retries--;
      await wait(3000);
    }
  }

  throw new Error("Kafka Producer failed to connect after retries");
};

/**
 * Publish events to Kafka
 */

export const publishEvent = async (topic: string, payload: any) => {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });
};