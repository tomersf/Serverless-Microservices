import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/UserModel";
import { Environment } from "./environment";

const JWT_SECRET = Environment.jwtSecret;

export const getSalt = async () => {
  return await bcrypt.genSalt();
};

export const getHashedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await getHashedPassword(enteredPassword, salt)) === savedPassword;
};

export const getToken = ({ email, user_id, phone, userType }: UserModel) => {
  return jwt.sign({ user_id, email, phone, userType }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyToken = async (
  token: string
): Promise<UserModel | false> => {
  try {
    if (token !== "" && token !== undefined) {
      const payload = await jwt.verify(token.split(" ")[1], JWT_SECRET);
      return payload as UserModel;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
