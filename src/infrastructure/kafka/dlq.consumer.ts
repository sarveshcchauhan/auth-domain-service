import { Kafka } from "kafkajs";
import { TOPICS } from "./topics";
import { ENV } from "../../config/env";

const kafka = new Kafka({
  clientId: "dlq-email",
  brokers: [ENV.KAFKA_BROKER || "auth-kafka:9092"],
});
const consumer = kafka.consumer({ groupId: "dlq-group" });

export const startDLQConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPICS.EMAIL_DLQ,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value!.toString());

      console.error("DLQ EVENT:", data);

      // store in DB / alert / manual retry later
    },
  });
};