import { sendEmail } from "../../email/smtp.service";

export const processEmail = async (event: any) => {
  try {
    await sendEmail(
      event?.payload.email,
      "Welcome!",
      "Registered successfully🎉",
      event,
    );
  } catch (err: any) {
    return err;
  }
};
