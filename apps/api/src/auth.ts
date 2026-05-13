import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "./env";

export type JwtUser = {
  userId: string;
};

export function signToken(payload: JwtUser) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtUser {
  return jwt.verify(token, env.JWT_SECRET) as JwtUser;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

