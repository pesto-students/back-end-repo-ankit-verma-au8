import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import {
  budgetDeleted,
  budgetSaved,
  budgetUpdated,
  saveBudgetFailed,
} from "../logEvents";
import * as repo from "./repo";
import { Budget } from "./types";
import db from "../db";
import * as _ from "ramda";
import { getTotalExpenseForCategory } from "../../src/expense/repo";
import { renderTemplate } from "../../src/whatsapp/domain";
import { getUserDetails } from "../../src/user/repo";
import { WhatsAppHandlerObj } from "../../src/whatsapp/types";

function getMonthStartAndEndDates() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const formattedStartDate = startDate.toLocaleString().split("T")[0];
  const formattedEndDate = endDate.toLocaleString().split("T")[0];
  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}

export default function expenseHandler(whatsAppHandler: WhatsAppHandlerObj) {
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

    updateBudget: async (budgetDetails: Budget, id) => {
      const budget = await repo.getBudgetDetails({
        id,
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

    deleteBudget: async (id) => {
      const budget = await repo.getBudgetDetails({
        id,
      });
      if (_.isNil(budget)) {
        return left("Budget doesn't exists for this category");
      }
      const result = await repo.deleteBudget({ id: budget.id });
      budgetDeleted(result);
      return right(result);
    },

    getBudget: async (userId) => {
      const budgets = await repo.getBudgetsList({ userId });
      const { startDate, endDate } = getMonthStartAndEndDates();
      for (let budget of budgets) {
        const data = await getTotalExpenseForCategory(
          userId,
          budget.categoryId,
          startDate,
          endDate
        );
        budget.categoryName = data[0]?.categoryName;
        budget.startDate = startDate;
        budget.endDate = endDate;
        budget.totalExpense = data[0]?.totalExpense;
      }
      return right(budgets);
    },
    /** Need improvement */
    sendBudgetReminder: async () => {
      const budgets = await repo.getBudgetsList({});
      const { startDate, endDate } = getMonthStartAndEndDates();
      for (let budget of budgets) {
        const data = await getTotalExpenseForCategory(
          budget.userId,
          budget.categoryId,
          startDate,
          endDate
        );
        if (data.length == 0) {
          console.log("No budgets are alarming currently...");
          return;
        }
        const expensePercent = data[0]?.totalExpense / budget.amount;
        const userDetails = await getUserDetails({ id: budget.userId });

        if (expensePercent > 0.5 && expensePercent < 0.9) {
          const messageText = renderTemplate("BudgetReminderTemplateYellow", {
            expensePercent: expensePercent,
            categoryName: data[0].categoryName,
          });
          await whatsAppHandler.sendTextMessage(
            userDetails.waNumber,
            messageText
          );
        } else if (expensePercent >= 0.9 && expensePercent <= 1) {
          const messageText = renderTemplate("BudgetReminderTemplateRed", {
            expensePercent: expensePercent,
            categoryName: data[0].categoryName,
          });
          await whatsAppHandler.sendTextMessage(
            userDetails.waNumber,
            messageText
          );
        } else {
          const messageText = renderTemplate("BudgetExceededReminder", {
            expensePercent: expensePercent,
            categoryName: data[0].categoryName,
          });
          await whatsAppHandler.sendTextMessage(
            userDetails.waNumber,
            messageText
          );
        }
      }
    },
  };
}
