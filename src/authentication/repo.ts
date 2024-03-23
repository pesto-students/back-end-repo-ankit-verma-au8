import { USER_TABLE } from "../user/constant";
import { SESSION_TABLE } from "./constant";
import Bcrypt from "bcrypt";
import db from "../db";
import * as _ from "ramda";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Scope } from "./types";

export async function saveSession(sessionId) {
  return await db(SESSION_TABLE).insert({ sessionId: sessionId });
}

export async function getSessionById(sessionId) {
  return db(SESSION_TABLE).select("*").where({ sessionId }).first();
}

export async function deleteSession(sessionId: string) {
  return db(SESSION_TABLE).delete().where({ sessionId: sessionId });
}

export const generateAuthToken = async (
  secret: string,
  userId: number,
  scope: Scope,
  expires: number | "never"
): Promise<string> => {
  /** expires is in days */
  const sessionId = uuidv4();
  await saveSession(sessionId);
  let jwtToken;
  if (expires === "never") {
    jwtToken = jwt.sign(
      { userId: userId, scope: scope, sessionId: sessionId },
      secret
    );
    return jwtToken;
  } else {
    jwtToken = jwt.sign(
      { userId: userId, scope: scope, sessionId: sessionId },
      secret,
      { expiresIn: expires * 24 * 60 * 60 }
    );
    return jwtToken;
  }
};
export const generateEmailVerificationToken = (
  secret: string,
  userId: number
) => {
  const jwtToken = jwt.sign({ userId }, secret);
  return jwtToken;
};
