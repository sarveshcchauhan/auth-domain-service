/**
 *  OUTBOX REPOSITORY
 *
 * Handles persistence of events before they are sent to Kafka.
 *
 * This ensures:
 * - Event durability
 * - Retry capability
 * - System recovery after crashes
 */

import { OutboxModel } from "../database/models/outbox.model";
import { OutboxRepository } from "./outbox.repository";

/**
 * MongoDB implementation of OutboxRepository
 */
export class OutboxRepositoryImpl implements OutboxRepository {
  async create(event: any): Promise<void> {
    await OutboxModel.create({
      eventId: event.eventId,
      eventType: event.eventType,
      payload: event,
    });
  }

  /**
   * Fetch pending events
   */
  async getPending(limit: number): Promise<any[]> {
    return OutboxModel.find({ status: "PENDING" }).limit(limit).lean();
  }

  /**
   * Lock event for processing
   *
   * Prevents duplicate processing by multiple workers.
   */
  markProcessing(eventId: string) {
    return OutboxModel.findOneAndUpdate(
      {
        eventId,
        status: "PENDING",
      },
      {
        $set: {
          status: "PROCESSING",
          processingAt: new Date(),
        },
      },
    );
  }
  /**
   * Mark event as successfully sent to Kafka
   */
  async markProcessed(eventId: string): Promise<void> {
    await OutboxModel.updateOne(
      { eventId },
      {
        $set: {
          status: "PROCESSED",
          processedAt: new Date(),
        },
      },
    );
  }
  /**
   * Mark event as failed
   */
  markFailed(eventId: string, error: string) {
    return OutboxModel.updateOne(
      { eventId },
      {
        $set: {
          status: "FAILED",
          error,
          failedAt: new Date(),
        },
      },
    );
  }
}
