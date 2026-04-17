import dotenv from "dotenv";

const environment = process.env.NODE_ENV === "development" ? ".env" : '.env.local'

dotenv.config({ path: environment });

export const ENV = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV,

  MONGO_URI: process.env.MONGO_URI!,

  REDIS_URL: process.env.REDIS_URL!,

  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,

  KAFKA_BROKER: process.env.KAFKA_BROKER,
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID!,
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID!,

  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: process.env.SMTP_PORT!,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  MAIL_FROM: process.env.MAIL_FROM!,

  SLACK_CHANNEL: process.env.SLACK_CHANNEL,

  OPEN_TELEMETRY: process.env.OPEN_TELEMETRY,
};