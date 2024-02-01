import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import { budgetSaved, budgetUpdated, saveBudgetFailed } from "../logEvents";
import * as repo from "./repo";
import { Budget } from "./types";
import db from "../db";
import * as _ from "ramda";

export default function expenseHandler() {
  return {
    saveBudget: async (budgetDetails: Budget) => {
      const budget = await repo.getBudgetDetails({
        categoryId: budgetDetails.categoryId,
        userId: budgetDetails.userId,
      });
      if (!_.isNil(budget)) {
        saveBudgetFailed({
          reason: "Budget already exists for this category",
          budget,
        });
        return left("Budget already exists for this category");
      }
      const result = await repo.saveBudget(budgetDetails);
      budgetSaved(result);
      return right(result);
    },

    updateBudget: async (budgetDetails: Budget) => {
      const budget = await repo.getBudgetDetails({
        id: budgetDetails.budgetId,
      });
      if (_.isNil(budget)) {
        return left("Budget doesn't exists for this category");
      }
      const result = await repo.updateBudget(
        _.omit(["budgetId"], budgetDetails),
        { id: budget.id }
      );
      budgetUpdated(result);
      return right(result);
    },
  };
}
