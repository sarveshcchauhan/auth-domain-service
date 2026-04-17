import { EventEnvelope } from "../../domain/events/event.types";

export interface OutboxRepository {
  create<T>(event: EventEnvelope<T>): Promise<void>;
  getPending(limit: number): Promise<any[]>;
  markProcessed(id: string): Promise<void>;
}