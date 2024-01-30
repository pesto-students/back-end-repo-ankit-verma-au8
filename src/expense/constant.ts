import {
  getCategoryPercentageSchema,
  getTotalExpenseSchema,
  getUserExpensesListSchema,
  saveExpenseSchema,
} from "./types";

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
  endPoint: "/user/expense/trend",
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

export const GET_CATEGORY_PERCENTAGE = {
  endPoint: "/user/expense/categories",
  method: "GET",
  auth: {
    scope: ["user"],
  },
  tags: ["get-category-expense-percentage", "api", "expense"],
  failAction: "log",
  reCaptcha: false,
  querySchema: getCategoryPercentageSchema,
  description: "Get expense percentage by category",
  notes: "Get expense percentage by category",
};

export const GET_TOTAL_EXPENSE = {
  endPoint: "/user/expense/total",
  method: "GET",
  auth: {
    scope: ["user"],
  },
  tags: ["get-expense-total", "api", "expense"],
  failAction: "log",
  reCaptcha: false,
  description: "Get total expense",
  notes: "Get total expense",
  querySchema: getTotalExpenseSchema,
};

export const GET_USER_EXPENSES_LIST = {
  endPoint: "/user/expenses/list",
  method: "GET",
  auth: {
    scope: ["user"],
  },
  tags: ["get-expenses-list", "api", "expense"],
  failAction: "log",
  reCaptcha: false,
  querySchema: getUserExpensesListSchema,
  description: "Get expenses list with pagination",
  notes: "Get expenses list",
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
