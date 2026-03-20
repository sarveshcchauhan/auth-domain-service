// Email runs asynchronously. 
import { Kafka } from "kafkajs";
import { ENV } from "../config/env";
import { sendEmail } from "../infrastructure/email/smtp.service";

const kafka = new Kafka({
  clientId: "email-service",
  brokers: [ENV.KAFKA_BROKER || "auth-kafka:9092"], //FOR DOCKER
  // brokers: [ENV.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "email-group" });

export const startEmailWorker = async () => {

  await consumer.connect();

  console.log("Kafka consumer connected");

  await consumer.subscribe({
    topic: "user-events",
    fromBeginning: true,
  });

  console.log("Subscribed to user-events");

  await consumer.run({
    eachMessage: async ({ message }) => {

      const data = JSON.parse(message.value!.toString());
      console.log("Received event:", data);
      // Normal kafka notification handling 

      // if (data.type === "USER_REGISTERED") {

      //   await sendEmail(
      //     data.email,
      //     "Welcome",
      //     "Thank you for registering"
      //   );

      // }

      /**
       * Dead Letter Queue
       * Create topic: email-dead-letter
       * Monitor failures and retry later manually or with another worker
       * Now email sending is reliable and does not block registration.
       */
      if (data.type === "USER_REGISTERED") {

        let attempts = 0;
        const maxAttempts = 5;
        let sent = false;

        while (attempts < maxAttempts && !sent) {
          try {
            await sendEmail(
              data.email,
              "Welcome to our platform",
              "Thanks for registering!"
            );
            sent = true;
            console.log("Email sent successfully");
          } catch (err) {
            attempts++;
            console.error(`Email attempt ${attempts} failed`, err);
          }
        }

        // If still failed, push to Dead Letter Queue
        if (!sent) {
          const producer = kafka.producer();
          await producer.connect();
          await producer.send({
            topic: "email-dead-letter",
            messages: [
              { value: JSON.stringify(data) }
            ],
          });
          await producer.disconnect();
          console.error("Email failed, sent to DLQ", data);
        }

      }
    },
  });

};