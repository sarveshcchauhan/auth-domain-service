/**
 * Retry Worker
 *
 * Retries failed events from DB
 */


import { InboxRepositoryImpl } from "../infrastructure/repositories/InboxRepositoryImpl";
import { usecase } from "../interfaces/kafka/message.handler";

const inboxRepo = new InboxRepositoryImpl();

export const retryWorker = async () => {
  const jobs = await inboxRepo.getRetryableEvents(50);

  for (const job of jobs) {
    try {
       await usecase.execute(job);

    } catch (err: any) {
      await inboxRepo.markFailure(
        job.eventId,
        err.message,
        job.retryCount + 1
      );
    }
  }
};