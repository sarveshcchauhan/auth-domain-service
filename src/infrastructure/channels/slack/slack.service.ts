import { logger } from "../../observability/logger";

export const processSlack = async (event: any) => {
  try {
    await sendSlack();

    logger.info({
      eventId: event.eventId,
      userId: event.userId,
      traceId: event.traceId,
      msg: "Slack Sent",
    });
  } catch (err) {
    logger.warn({
      eventId: event.eventId,
      userId: event.userId,
      traceId: event.traceId,
      channel: "slack",
      msg: "Failed to sent slack message",
      err
    });
  }
};

const isChannelExist = (err: any) => {
  return err?.code !== "INVALID_CHANNEL";
};

const sendSlack = () => {
  return {};
};
