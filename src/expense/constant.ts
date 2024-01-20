import { saveExpenseSchema } from "./types";

export const EXPENSE_TABLE = "expenses";

export const SAVE_EXPENSE = {
  endPoint: "/user/expense",
  method: "POST",
  auth: {
    scope: ["user"],
  },
  tags: ["save-expense", "api", "expense"],
  failAction: "log",
  reCaptcha: false,
  payloadSchema: saveExpenseSchema,
  description: "Save expense api",
  notes: "Save expense api",
};
