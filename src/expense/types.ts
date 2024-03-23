import * as Joi from "joi";

export enum allCategories {
  food_drinks = "Food/Drinks",
  clothing = "Clothing",
  technology = "Technology",
  transportation = "Transportation",
  gifts = "Gifts",
  entertainment = "Entertainment",
  books_magazines = "Books/Magazine",
  education = "Education",
  sports = "Sports",
  pets = "Pets",
  travel = "Travel",
}

export type TrendsInterval = "daily" | "weekly" | "monthly";

export enum trendsInterval {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
}

export const saveExpenseSchema = Joi.object({
  amount: Joi.number().required(),
  categoryId: Joi.number().required(),
  textMessage: Joi.string().allow("").allow(null),
});

export type Expense = {
  userId: Number;
  amount: Number;
  textMessage: String;
  categoryId: number;
  categoryName?: string;
};

export type ExpenseSaveResponse =
  | "Expense saved"
  | "User message is not valid"
  | "User does not exist";

export type NlpOutput = {
  expenses: ExpenseArray;
};

export type ExpenseArray = Array<{
  amount: number;
  category: string;
  text: string;
}>;

export type InWaMessageData = {
  event: string;
  instanceId: string;
  data: {
    message: {
      _data: {
        from: string;
        to: string;
        body: string;
      };
    };
  };
};

export type ExtractExpenseDataFromWaError =
  | "userDoesNotExist"
  | "invalidUserMessage";

export const getUserExpensesListSchema = Joi.object({
  limit: Joi.number().positive().greater(0).required(),
  page: Joi.number().positive().greater(0).required(),
  categoryId: Joi.number().positive().greater(0).optional(),
  from: Joi.string().optional(),
  to: Joi.string().optional(),
});

export const getUserExpensesTrendsSchema = Joi.object({
  interval: Joi.string().valid("daily", "weekly", "monthly").required(),
});

export const getTotalExpenseSchema = Joi.object({
  month: Joi.number().optional(),
  year: Joi.number().optional(),
});

export const getCategoryPercentageSchema = Joi.object({
  month: Joi.number().optional(),
  year: Joi.number().optional(),
});
