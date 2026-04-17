/**
 * Creates a DLQ-safe event
 *
 * Keeps original event intact and wraps failure info
 */

import { EventEnvelope } from "../../domain/events/event.types";

export const createDLQEvent = (
  event: EventEnvelope<any>,
  err: any
): EventEnvelope<any> => {
  return {
    ...event,

    eventType: "DLQ_" + event.eventType, // ✅ explicit DLQ type

    metadata: {
      ...event.metadata,
    },

    payload: {
      originalPayload: event.payload,
      error: err.message,
      failedAt: new Date().toISOString(),
    },
  };
};