import * as Joi from "joi";

export const saveBudgetSchema = Joi.object({
  amount: Joi.number().required(),
  categoryId: Joi.number().required(),
  reminders: Joi.boolean().required(),
});

export const updateBudgetSchema = Joi.object({
  amount: Joi.number(),
  budgetId: Joi.number().required(),
  categoryId: Joi.number(),
  reminders: Joi.boolean(),
});

export type Budget = {
  budgetId?: number; //TODO: Refactor
  amount: number;
  userId: number;
  categoryId: number;
  reminders: false;
};
