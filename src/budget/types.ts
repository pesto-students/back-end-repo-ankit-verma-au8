import * as Joi from "joi";

export const saveBudgetSchema = Joi.object({
  amount: Joi.number().required(),
  categoryId: Joi.number().required(),
  reminders: Joi.boolean().required(),
});

export const updateBudgetSchema = Joi.object({
  amount: Joi.number(),
  categoryId: Joi.number(),
  reminders: Joi.boolean(),
});

export const updateBudgetParamSchema = Joi.object({
  id: Joi.number().required(),
});
export type Budget = {
  amount: number;
  userId: number;
  categoryId: number;
  reminders: false;
};
