import {
  saveBudgetSchema,
  updateBudgetSchema,
  updateBudgetParamSchema,
} from "./types";

export const SAVE_BUDGET = {
  endPoint: "/user/budget",
  method: "POST",
  auth: {
    scope: ["user"],
  },
  tags: ["save-budget", "api", "budget"],
  failAction: "log",
  reCaptcha: false,
  payloadSchema: saveBudgetSchema,
  description: "Save budget api",
  notes: "Save budget api",
};

export const UPDATE_BUDGET = {
  endPoint: "/user/budget/{id}",
  method: "PUT",
  auth: {
    scope: ["user"],
  },
  tags: ["update-budget", "api", "budget"],
  failAction: "log",
  reCaptcha: false,
  payloadSchema: updateBudgetSchema,
  paramSchema: updateBudgetParamSchema,
  description: "Update budget api",
  notes: "Update budget api",
};
