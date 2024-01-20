import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import { expenseSaved } from "../logEvents";
import * as repo from "./repo";
import { Expense } from "./types";

export default function userHandler(config) {
  return {
    saveExpense: async (expenseDetails: Expense) => {
      const result = await repo.saveExpense(expenseDetails);
      expenseSaved(result);
      return right(result);
    },
  };
}
