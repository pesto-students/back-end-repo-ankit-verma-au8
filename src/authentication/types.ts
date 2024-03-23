import * as Joi from "joi";

export const loginSchema = Joi.object({
  waNumber: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  staySignedIn: Joi.boolean().required(),
});

export const loginResponseSchema = Joi.object({
  authToken: Joi.string().required(),
  userId: Joi.number().required(),
});

export const logoutResponseSchema = Joi.object({});

export type Scope = "admin" | "user";

export interface LoginDetail {
  waNumber: string;
  password: string;
  role: Scope;
  staySignedIn: Boolean;
}

export type LoginError =
  | "No account exist for this number"
  | "Incorrect password";

export interface LoginResponse {
  authToken: string;
  userId: number;
}
