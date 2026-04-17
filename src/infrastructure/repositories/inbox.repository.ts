import { EventEnvelope } from "../../domain/events/event.types";

/**
 * Inbox repository contract
 */
export interface InboxRepository {
  create<T>(event: EventEnvelope<T>): Promise<boolean>;
  markSuccess(eventId: string): Promise<void>;
  markFailure(eventId: string, error: string, retryCount: number): Promise<void>;
  getRetryableEvents(limit: number): Promise<any[]>;
}