import { Kafka } from "kafkajs";
import { ENV } from "../../config/env";

export const kafka = new Kafka({
  clientId: ENV.KAFKA_CLIENT_ID,
  brokers: [ENV.KAFKA_BROKER || "auth-kafka:9092"],
});

export const producer = kafka.producer({
  allowAutoTopicCreation: false,
});
export const consumer = kafka.consumer({ groupId: ENV.KAFKA_GROUP_ID });
