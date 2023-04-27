import { RedisClientType } from "@redis/client";
import sgMail from "@sendgrid/mail";
import { v4 } from "uuid";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const EMAIL_VERIFICATION_PREFIX = "email-verification";

interface VerifyEmailProps {
  email: string;
  userId: string;
  redis: RedisClientType;
}

export const sendVerificationEmail = async ({
  email,
  userId,
  redis,
}: VerifyEmailProps) => {
  const token = v4();
  const key = EMAIL_VERIFICATION_PREFIX + token;
  redis.set(key, userId);
  const url = `http://localhost:3000/email-verification/${token}`;
  const msg: sgMail.MailDataRequired = {
    to: email,
    from: {
      email: "noreply@email.dayto.app",
      name: "Dayto",
    },
    templateId: "d-2c1cd4ddad7349a6a64d52935ccab57e",
    dynamicTemplateData: {
      url,
    },
    trackingSettings: {
      clickTracking: {
        enable: false,
        enableText: false,
      },
    },
  };
  console.log("here");
  const result = await sgMail.send(msg);
  console.log(result[0].toString());
};
