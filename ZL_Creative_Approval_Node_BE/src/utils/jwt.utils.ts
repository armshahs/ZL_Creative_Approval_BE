import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { config } from "../config";

dotenv.config();

export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, config.auth.jwtSecret as string, {
    expiresIn: "720h",
  });
};
