/**
 * Use case for publishing events.
 *
 * Instead of directly sending to Kafka,
 * we store event in Outbox (guarantee).
 */

import { EventEnvelope } from "../../domain/events/event.types";

export class PublishEventUseCase {
  constructor(private outboxRepo: any) {}

  /**
   * Stores event in outbox
   */
  async execute(event: EventEnvelope<any>) {
    await this.outboxRepo.create(event);
  }
}