import app from "./app";
import { connectMongo } from "./infrastructure/database/mongo.connection";
import { connectRedis } from "./infrastructure/cache/redis.client";
import { connectProducer } from "./infrastructure/kafka/producer";

const startServer = async () => {

  await connectMongo();

  await connectRedis();
  
  await connectProducer();

  app.listen(4000, () => {
    console.log("Auth Service running on port 4000");
  });

};

startServer();