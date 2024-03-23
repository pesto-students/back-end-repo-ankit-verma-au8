import * as Joi from "joi";

export const signUpSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email(),
  waNumber: Joi.string().min(10).required(),
  password: Joi.string().min(8).required(),
});

export type User = {
  firstName: string;
  lastName: string;
  email?: string;
  waNumber: string;
  password: string;
  role?: string;
};

export type SaveUserError = "WhatsApp number is already registered";
export type UserId = number;
