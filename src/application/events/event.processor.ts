/**
 * Business logic processor.
 *
 * This is where actual work happens (e.g., sending email).
 *
 * IMPORTANT:
 * - Must be idempotent
 * - Should not assume single execution
 */

import { USER_REGISTERED } from "../../utils/constant";
import { processEmail } from "../../infrastructure/channels/email/email.service";
import { processSlack } from "../../infrastructure/channels/slack/slack.service";
import { EventEnvelope } from "../../domain/events/event.types";
import { logger } from "../../infrastructure/observability/logger";
import { resolveChannels } from "../../infrastructure/kafka/handlers/channel.resolver";

/**
 * Processes incoming event.
 *
 * @param event Event envelope
 */
export const processEvent = async (event: EventEnvelope<any>): Promise<void> => {
  switch (event.eventType) {
    case USER_REGISTERED:
      await handleEmailSlackNotification(event);
      break;
    case "SLACK_NOTIFY":
      await handleSlackNotification(event);
      break;
    default:
      logger.warn({
        eventType: event.eventType,
        msg: "Unhandled event type",
      });
      break;
  }
};

/**
 * Handles user registration event.
 *
 * @param event Event data
 */
const handleEmailSlackNotification = async (event: any) => {
  // Conditional channel execution
  const channels = await resolveChannels(event);

  const promises: Promise<void>[] = [];

  if (channels?.email) {
    promises.push(processEmail(event));
  }

  if (channels.slack) {
    promises.push(processSlack(event));
  }

  await Promise.all(promises);
};

const handleSlackNotification = async (event: any) => {
  const channels = await resolveChannels(event);

  const promises: Promise<void>[] = [];

  if (channels.slack) {
    promises.push(processSlack(event));
  }

  await Promise.all(promises);
};
