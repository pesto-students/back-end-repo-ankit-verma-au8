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

export const SAVE_WA_EXPENSE = {
  endPoint: "/user/wa/expense",
  method: "POST",
  auth: false,
  tags: ["save-wa-expense", "api", "expense"],
  reCaptcha: false,
  description: "Save WA expense api",
  notes: "Save WA expense api",
};
