/**
 * Outbox Worker
 *
 * Reads events from DB and publishes to Kafka.
 */
import { producer } from "../infrastructure/kafka";
import { connectProducer } from "../infrastructure/kafka/producer";
import { logger } from "../infrastructure/observability/logger";
import { OutboxRepositoryImpl } from "../infrastructure/repositories/OutboxRepositoryImpl";
import { trace } from "@opentelemetry/api";
import { wait } from "../utils/delay";

const tracer = trace.getTracer("kafka-producer");

const outboxRepo = new OutboxRepositoryImpl();

const BATCH_SIZE = 50;
const INTERVAL_MS = 3000;

/**
 * OUTBOX WORKER (Core Event Dispatcher)
 *
 * This worker is responsible for bridging the gap between:
 *
 *   MongoDB (Outbox Table) → Kafka → Consumers
 *
 * --------------------------------------------------------
 *
 * WHY THIS EXISTS:
 * --------------------------------------------------------
 * MongoDB does NOT push events to Kafka.
 * So we implement a polling worker that:
 *
 * 1. Reads pending events from DB
 * 2. Publishes them to Kafka
 * 3. Marks them as processed
 *
 * This guarantees:
 * - No event loss (durability)
 * - Retry safety
 * - Decoupling between API and Kafka
 *
 * --------------------------------------------------------
 *
 * EVENT LIFECYCLE:
 * --------------------------------------------------------
 * PENDING → PROCESSING → PROCESSED → (optional DELETE later)
 *
 * If failure occurs:
 * PENDING → PROCESSING → FAILED
 *
 * --------------------------------------------------------
 *
 * IMPORTANT DESIGN RULES:
 * --------------------------------------------------------
 * Never send Kafka directly from service layer
 * Never skip PROCESSING lock (prevents duplicates)
 * Never assume single worker instance
 *
 * ✔ Always use atomic state transitions
 * ✔ Always make worker idempotent
 */

/**
 * Starts the Outbox Worker loop
 *
 * This function:
 * - Connects Kafka producer
 * - Starts polling loop using setInterval
 * - Continuously processes pending events
 *
 * NOTE:
 * setInterval is used because MongoDB does not support push-based events.
 */
export const outboxWorker = async () => {
  await connectProducer();

  console.log("Outbox Worker Started");

  /**
   *  Polling loop
   *
   * Runs every INTERVAL_MS and processes pending events.
   *
   * WARNING:
   * If processing time > interval time,
   * multiple executions may overlap (handle via PROCESSING lock).
   */
  setInterval(async () => {
    try {
      /**
       *  Fetch pending events from DB
       *
       * Only events with status = "PENDING" are fetched.
       */
      const events = await outboxRepo.getPending(BATCH_SIZE);

      if (!events.length) return;

      console.log(`Found ${events.length} pending events`);

      /**
       * STEP 1: PROCESS EACH EVENT
       */
      for (const event of events) {
        const span = tracer.startSpan("publishEvent");
        try {
          span.setAttribute("eventType", event.eventType);
          span.setAttribute("eventId", event.eventId);

          await outboxRepo.markProcessing(event.eventId);

          /**
           * Publish event to Kafka
           *
           * Kafka acts as transport layer only.
           */
          await producer.send({
            topic: event.payload.topic,
            messages: [
              {
                key: event.eventId, // ensures partition consistency
                value: JSON.stringify(event.payload),
              },
            ],
          });

          /**
           * Mark event as successfully processed
           */
          await outboxRepo.markProcessed(event.eventId);

          span.addEvent("Kafka events sent");

          console.log("Sent event:", event.eventId);

          logger.info({
            ...event.payload,
            msg: "Event published",
          });
        } catch (err: any) {
          console.error("Failed event:", event.eventId, err.message);

          /**
           * Handle publish failure
           *
           * Event is marked FAILED so it can be retried later.
           */
          await outboxRepo.markFailed(event.eventId, err.message);
        } finally {
          span.end();
        }
      }
    } catch (err) {
      /**
       * Critical worker failure
       *
       * This should NEVER crash the worker loop.
       */
      console.error("Outbox worker loop failed:", err);
    }
  }, INTERVAL_MS);
};
