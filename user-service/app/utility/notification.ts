import twilio from "twilio";
import { Environment } from "./environment";

const accountSid = Environment.accountSid;
const authToken = Environment.authToken;

const client = twilio(accountSid, authToken);

export const generateAccessCode = () => {
  const code = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { code, expiry };
};

export const sendVerificationCode = async (
  code: number,
  toPhoneNumber: string
) => {
  const response = await client.messages.create({
    body: `Your verification code is ${code} it will expire in 30min`,
    from: "+15856342182",
    to: toPhoneNumber.trim(),
  });
  console.log(response);
  return response;
};
