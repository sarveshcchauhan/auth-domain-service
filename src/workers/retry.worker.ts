import { startRetryConsumer } from "../infrastructure/kafka/retry.consumer";

startRetryConsumer()
  .then(() => console.log("Email Retry Worker started"))
  .catch((err) => console.error("Email Retry Worker failed", err));