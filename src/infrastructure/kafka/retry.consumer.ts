import { Kafka } from "kafkajs";
import { TOPICS } from "./topics";
import { publishEvent } from "./producer";
import { sendEmail } from "../email/smtp.service";
import { ENV } from "../../config/env";

const kafka = new Kafka({
  clientId: "retry-email",
  brokers: [ENV.KAFKA_BROKER || "auth-kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "email-retry-group" });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const startRetryConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPICS.EMAIL_RETRY_1,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value!.toString());

      try {
        await delay(5000); // ⏳ backoff

        await sendEmail(
          data.email,
          "Retry Email",
          "Retry attempt"
        );

        console.log("Retry success");

      } catch (err) {
        console.error("Retry failed retry2");

        await publishEvent(TOPICS.EMAIL_RETRY_2, {
          ...data,
          attempt: 2,
        });
      }
    },
  });
};