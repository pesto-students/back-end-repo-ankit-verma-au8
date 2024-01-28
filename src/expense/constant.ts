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

export const GET_EXPENSE_OVERVIEW = {
  endPoint: "/user/expense/overview",
  method: "GET",
  auth: {
    scope: ["user"],
  },
  tags: ["get-expense-overview", "api", "expense"],
  failAction: "log",
  reCaptcha: false,
  description: "Get expense overview",
  notes: "Get expense overview",
};

export const SAVE_DUMMY_EXPENSE_DATA = {
  endPoint: "/expenses/user/dummy-data",
  method: "POST",
  auth: false,
  tags: ["save-dummy-expense-data", "api", "expense"],
  failAction: "log",
  reCaptcha: false,
  description: "Save expense dummy data",
  notes: "Save expense dummy data",
};
