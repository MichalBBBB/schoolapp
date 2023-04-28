import { RedisClientType } from "@redis/client";
import sgMail from "@sendgrid/mail";
import { v4 } from "uuid";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const RESET_PASSWORD_PREFIX = "reset-password";

interface ResetPasswordProps {
  email: string;
  name: string;
  userId: string;
  redis: RedisClientType;
}

export const sendResetPasswordEmail = async ({
  email,
  userId,
  redis,
  name,
}: ResetPasswordProps) => {
  const token = v4();
  const key = RESET_PASSWORD_PREFIX + token;
  redis.set(key, userId);
  const url = `http://localhost:3000/reset-password/${token}`;
  const msg: sgMail.MailDataRequired = {
    to: email,
    from: {
      email: "noreply@email.dayto.app",
      name: "Dayto",
    },
    templateId: "d-594185dcae504ac0b8753855dbfc487b",
    dynamicTemplateData: {
      url,
      name,
    },
    trackingSettings: {
      clickTracking: {
        enable: false,
        enableText: false,
      },
    },
  };
  const result = await sgMail.send(msg);
  console.log(result[0].toString());
};
