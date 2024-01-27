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
};

export type NlpOutput = {
  amount: number;
  category: string;
  text: string;
};

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
