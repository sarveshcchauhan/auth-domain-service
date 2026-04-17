import { wait } from "../../utils/delay";
import { logger } from "../observability/logger";
import { producer } from ".";
import { v4 as uuid } from "uuid";
import { trace } from "@opentelemetry/api";
import { EventEnvelope } from "../../domain/events/event.types";
import { createEvent } from "../../application/events/createEvent.factory";

const tracer = trace.getTracer("kafka-producer");

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

// export const publishEvent = async <T>(
//   eventType: string,
//   topic: string,
//   payload: T,
//   ctx: {
//     traceId: string;
//     correlationId: string;
//     userId?: string;
//   },
// ) => {

//   const span = tracer.startSpan("publishEvent");
//   const event: EventEnvelope<T> = createEvent(
//     eventType,
//     topic,
//     payload,
//     ctx,
//   );

//   span.setAttribute("eventType", eventType);
//   span.setAttribute("userId", event.userId || event.eventId);

//   await producer.send({
//     topic,
//     messages: [
//       {
//         key: ctx.userId || event.eventId, 
//         value: JSON.stringify(event),
//         headers: {
//           ...ctx,
//         },
//       },
//     ],
//   });

//   span.addEvent("Kafka message sent");
//   span.end()
//   logger.info({
//     eventId: event.eventId,
//     userId: ctx.userId,
//     traceId: ctx.traceId,
//     topic,
//     msg: "Event published",
//   });
// };
