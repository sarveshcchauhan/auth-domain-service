import nodemailer from "nodemailer";
import { ENV } from "../../config/env";
import { logger } from "../observability/logger";


const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST || "mailhog",
  port: Number(ENV.SMTP_PORT) || 1025,
  secure: false,
  // auth: {
  //   user: ENV.SMTP_USER,
  //   pass: ENV.SMTP_PASS,
  // },
  //Replace it with your GMAIL or other SMTP service. Since we are using mailhog we do not require this
});

/**
 * Sends email through SMTP
 */
/**
 * Sends email using SMTP transporter
 *
 * Throws error so retry system can handle failures.
 */

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  event: any,
) => {
  try {
    await transporter.sendMail({
      from: ENV.MAIL_FROM || "no-reply@example.com",
      to,
      subject,
      text,
    });

    logger.info({
      eventId: event.eventId,
      userId: event.userId,
      traceId: event.traceId,
      msg: "Email sent successfully",
    });

  } catch (err: any) {

    let errorCode = "UNKNOWN_ERROR";

    if (err.message === "No recipients defined") {
      errorCode = "INVALID_EMAIL";
    }

    if (
      err.code === "EHOSTUNREACH" ||
      err.code === "ECONNREFUSED"
    ) {
      errorCode = "EMAIL_SERVICE_DOWN";
    }

    logger.error({
      eventId: event.eventId,
      userId: event.userId,
      traceId: event.traceId,
      errorCode,
      err,
      msg: "Email sending failed",
    });

    // Throw structured error
    throw {
      code: errorCode,
      message: err.message,
      retryable: errorCode !== "INVALID_EMAIL", // key insight
    };
  }
};