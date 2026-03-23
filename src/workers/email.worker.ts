import { startEmailConsumer } from "../infrastructure/kafka/email.consumer";

startEmailConsumer()
  .then(() => console.log("Email Worker started"))
  .catch((err) => console.error("Email Worker failed", err));