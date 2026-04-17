/**
 * Validates event before processing.
 *
 * Prevents malformed events from breaking consumers.
 */

import { EventEnvelope } from "../../domain/events/event.types";

export const validateEvent = (event: EventEnvelope<any>) => {
  if (!event.eventId || !event.eventType) {
    throw new Error("INVALID_EVENT");
  }

  if (!event.metadata) {
    throw new Error("MISSING_METADATA");
  }
};