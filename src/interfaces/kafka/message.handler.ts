/**
 * Kafka Message Handler (Entry Point)
 *
 * Responsibilities:
 * - Parse message
 * - Call use case
 * - No business logic here
 */

import { EachMessagePayload } from "kafkajs";

import { processEvent } from "../../application/events/event.processor";
import { InboxRepositoryImpl } from "../../infrastructure/repositories/InboxRepositoryImpl";
import { ProcessEventUseCase } from "../../application/usecases/ProcessEvent.usecase";
import { DLQUseCase } from "../../application/usecases/dlq.usecase";
import { EventEnvelope } from "../../domain/events/event.types";
import { OutboxRepositoryImpl } from "../../infrastructure/repositories/OutboxRepositoryImpl";

const inboxRepo = new InboxRepositoryImpl();
const outboxRepo = new OutboxRepositoryImpl();
const dlqUseCase = new DLQUseCase(outboxRepo);

export const usecase = new ProcessEventUseCase(
  inboxRepo,
  processEvent,
  dlqUseCase,
  outboxRepo
);

/**
 * Kafka Consumer Handler
 * Ensures:
 * - Idempotency via Inbox
 * - No duplicate execution
 * - Proper retry/DLQ flow
 */
export const handleMessage = async ({ message }: EachMessagePayload) => {
  const event: EventEnvelope<any> = JSON.parse(message.value!.toString());
  // await processEvent(event);
  // ONLY use usecase (single entry point)
  await usecase.execute(event);
};