/**
 * Creates a retry version of an existing event.
 *
 * Used when processing fails.
 */

import { EventEnvelope } from "../../domain/events/event.types";

/**
 * Returns a new event with incremented retry metadata.
 *
 * @param event Original event
 */
export const createRetryEvent = <T>(
  event: EventEnvelope<T>
): EventEnvelope<T> => {
  return {
    ...event,
    metadata: {
      ...event.metadata,
      retryCount: event.metadata.retryCount + 1,
    },
    timestamp: new Date().toISOString(),
  };
};