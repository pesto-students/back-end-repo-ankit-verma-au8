import { User, SaveUserError, UserId } from "./types";
import { PROFESSIONS_TABLE, USER_TABLE } from "./constant";
import Bcrypt from "bcrypt";
import db from "../db";
import * as _ from "ramda";
import { left, Either, right } from "fp-ts/lib/Either";

export const getUserDetails = async (query) => {
  return db(USER_TABLE).select("*").where(query).first();
};

export const saveUserDetails = async (
  userDetails: User
): Promise<Either<SaveUserError, UserId>> => {
  const existingUser = await getUserDetails({ waNumber: userDetails.waNumber });
  if (!_.isNil(existingUser)) {
    return left("WhatsApp number is already registered");
  }
  const hashedPassword = await Bcrypt.hash(userDetails.password, 10);
  const result = await db(USER_TABLE)
    .insert({ ...userDetails, password: hashedPassword })
    .returning("id");
  return right(result[0]);
};
