import nodemailer from "nodemailer";
import { ENV } from "../../config/env";

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

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  await transporter.sendMail({
    from: ENV.MAIL_FROM || "no-replay@example.com",
    to,
    subject,
    text,
  });
};