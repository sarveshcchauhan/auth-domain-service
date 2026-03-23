import { startDLQConsumer } from "../infrastructure/kafka/dlq.consumer";

startDLQConsumer()
  .then(() => console.log("DLQ Worker started"))
  .catch((err) => console.error("DLQ Worker failed", err));