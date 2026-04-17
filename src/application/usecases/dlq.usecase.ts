/**
 * DLQ Use Case
 *
 * Sends failed events to DLQ via Outbox (guaranteed)
 */

import { EventEnvelope } from "../../domain/events/event.types";
import { createDLQEvent } from "../events/createDLQEvent.factory";


export class DLQUseCase {
  constructor(private outboxRepo: any) {}

  async execute(event: EventEnvelope<any>, err: any) {
    const dlqEvent = createDLQEvent(event, err);

    // ensures reliability via outbox pattern
    await this.outboxRepo.create(dlqEvent);
  }
}