import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const generateToken = (userId: string, tokenType: string) => {
  const secretType = tokenType === "jwt" ? ENV.JWT_SECRET : ENV.JWT_REFRESH_SECRET;
  const expiry = tokenType === "jwt" ? ENV.JWT_EXPIRES_IN : ENV.JWT_REFRESH_EXPIRES_IN;

  return jwt.sign({ userId }, secretType, {
    expiresIn: expiry,
  });
};

export const verifyToken =  (token: string, tokenType: string) => {
  const secretType = tokenType === "jwt" ? ENV.JWT_SECRET : ENV.JWT_REFRESH_SECRET;

  try {
    const decoded = jwt.verify(token, secretType);
    return decoded;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};