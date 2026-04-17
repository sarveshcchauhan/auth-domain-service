/**
 *
 * Core Event Contract used across the system.
 *
 * This file belongs to the DOMAIN layer:
 * - No infrastructure logic
 * - No framework dependencies
 * - Defines the shape of all events in the system
 */
import { v4 as uuid } from "uuid";

/**
 * Metadata associated with an event.
 *
 * Used for:
 * - Retry tracking
 * - Failure handling
 */
export interface EventMetadata {
  retryCount: number;
  maxRetries: number;
}

/**
 * Generic Event Envelope
 *
 * This is the standard structure for all events in the system.
 *
 * @template T Type of the event payload
 */
export interface EventEnvelope<T> {
  /** Version of the event schema */
  eventVersion: number;

  /** Unique identifier for the event */
  eventId: string;

  /** Service that produced the event */
  producer: string;

  /** Retry and delivery metadata */
  metadata: EventMetadata;

  /** ISO timestamp when event was created */
  timestamp: string;

  /** Logical type of event (e.g., USER_REGISTERED) */
  eventType: string;

  /** Kafka topic or routing key */
  topic: string;

  /** Actual business data */
  payload: T;

  /** Distributed tracing ID */
  traceId: string;

  /** Correlates events across services */
  correlationId: string;

  /** Optional user reference */
  userId?: string;
}
