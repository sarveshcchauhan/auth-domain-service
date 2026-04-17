import { EventEnvelope } from "../../domain/events/event.types";
import { OutboxRepository } from "../../infrastructure/repositories/outbox.repository";
import { createRetryEvent } from "../events/retryEvent.factory";

/**
 * Handles:
 * - Idempotency (Inbox)
 * - Retry logic
 * - DLQ routing
 */
export class ProcessEventUseCase {
  constructor(
    private inboxRepo: any,
    private processor: any,
    private dlqUseCase: any,
    private outboxRepo: OutboxRepository, // needed for retry
  ) {}

  async execute(event: EventEnvelope<any>) {
    // Idempotency check
    const isNew = await this.inboxRepo.create(event);
    if (!isNew) return;

    try {
      await this.processor(event);

      await this.inboxRepo.markSuccess(event.eventId);
    } catch (err: any) {
      const retryCount = (event.metadata?.retryCount ?? 0) + 1;

      // Do not retry invalid emails
      if (err.retryable === false) {
        await this.dlqUseCase.execute(event, err);
        return;
      }

      // Retry via OUTBOX (NOT direct)
      if (retryCount <= event.metadata.maxRetries) {
        const retryEvent = createRetryEvent(event);
        await this.outboxRepo.create(retryEvent);

        await this.inboxRepo.markFailure(
          event.eventId,
          err.message,
          retryCount,
        );
        return;
      }

      // Max retries -> DLQ
      await this.dlqUseCase.execute(event, err);

      await this.inboxRepo.markFailure(event.eventId, err.message, retryCount);
    }
  }
}
