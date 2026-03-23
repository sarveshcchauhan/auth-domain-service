import { Kafka } from "kafkajs";
import { TOPICS } from "./topics";
import { publishEvent } from "./producer";
import { sendEmail } from "../email/smtp.service";
import { ENV } from "../../config/env";

const kafka = new Kafka({
  clientId: "email",
  brokers: [ENV.KAFKA_BROKER || "auth-kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "email-group" });

export const startEmailConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPICS.USER_EVENTS,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value!.toString());

      if (data.type === "USER_REGISTERED") {
        try {
          await sendEmail(
            data.email,
            "Welcome!",
            "Thanks for registering 🎉"
          );

          console.log("Email sent");

        } catch (err) {
          console.error("Email failed retry1");

          await publishEvent(TOPICS.EMAIL_RETRY_1, {
            ...data,
            attempt: 1,
          });
        }
      }
    },
  });
};