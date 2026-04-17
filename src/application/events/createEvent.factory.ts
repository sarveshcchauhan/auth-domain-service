/**
 * Factory for creating standardized events.
 *
 * Ensures:
 * - Consistent structure
 * - Default metadata
 * - Traceability across services
 */

import { v4 as uuid } from "uuid";
import { EventEnvelope } from "../../domain/events/event.types";

/**
 * Context required for event creation.
 */
interface EventContext {
  traceId: string;
  correlationId: string;
  userId?: string;
}

/**
 * Creates a new event envelope.
 *
 * @param eventType Logical event name
 * @param topic Kafka topic
 * @param payload Event payload
 * @param ctx Context (trace/correlation/user)
 *
 * @returns Standardized EventEnvelope
 */
export const createEvent = <T>(
  eventType: string,
  topic: string,
  payload: T,
  ctx: EventContext
): EventEnvelope<T> => {
  return {
    eventVersion: 1,
    eventId: uuid(),

    producer: "auth-service",

    metadata: {
      retryCount: 0,
      maxRetries: 3,
    },

    timestamp: new Date().toISOString(),

    eventType,
    topic,
    payload,

    traceId: ctx.traceId,
    correlationId: ctx.correlationId,
    userId: ctx.userId,
  };
};