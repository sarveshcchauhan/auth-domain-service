import pino from "pino";
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = pino({
  transport: {
    targets: [
      {
        target: "pino/file",
        options: { destination: "./logs/app.log" }, // ✅ file logging
      },
    ],
  },
});