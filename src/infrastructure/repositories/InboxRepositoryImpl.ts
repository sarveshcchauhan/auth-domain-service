import { InboxModel } from "../database/models/inbox.model";
import { InboxRepository } from "./inbox.repository";

/**
 * MongoDB implementation of InboxRepository
 */
export class InboxRepositoryImpl implements InboxRepository {
  /**
   * Inserts new event (idempotency check)
   *
   * Uses unique index on eventId
   */
  async create(event: any): Promise<boolean> {
    try {
      await InboxModel.create({
        eventId: event.eventId,
        eventType: event.eventType,
        retryCount: event.metadata.retryCount,
      });

      return true;
    } catch (err: any) {
      if (err.code === 11000) return false; // duplicate
      throw err;
    }
  }

  /**
   * Marks event as successfully processed
   */
  async markSuccess(eventId: string): Promise<void> {
    await InboxModel.updateOne(
      { eventId },
      {
        $set: {
          status: "DONE",
          updatedAt: new Date(),
        },
      },
    );
  }

  /**
   * Marks failure and schedules retry
   */
  async markFailure(
    eventId: string,
    error: string,
    retryCount: number,
  ): Promise<void> {
    const delay = Math.min(2 ** retryCount * 1000, 300000); // max 5 min

    await InboxModel.updateOne(
      { eventId },
      {
        $set: {
          status: "FAILED",
          retryCount,
          lastError: error,
          nextRetryAt: new Date(Date.now() + delay),
          updatedAt: new Date(),
        },
      },
    );
  }

  /**
   * Fetch retryable events
   */
  async getRetryableEvents(limit: number): Promise<any[]> {
    const docs = await InboxModel.find({
      status: "FAILED",
      nextRetryAt: { $lte: new Date() },
    })
      .limit(limit)
      .lean();

    return docs?.map((d:any) => d.payload);
  }
}
