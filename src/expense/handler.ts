import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import { expenseSaved } from "../logEvents";
import * as repo from "./repo";
import { Expense } from "./types";
import { extractExpenseDataFromWa } from "./domain";
import { WhatsAppHandlerObj } from "../../src/whatsapp/types";
import { renderTemplate } from "../../src/whatsapp/domain";
import { nlpHandlerObj } from "../../src/nlp/types";
import { getRandomValueFromArray } from "test/env/factories";
import db from "../db";

export default function expenseHandler(
  config,
  whatsAppHandler: WhatsAppHandlerObj,
  nlpHandler: nlpHandlerObj
) {
  return {
    saveExpense: async (expenseDetails: Expense) => {
      const result = await repo.saveExpense(expenseDetails);
      expenseSaved(result);
      return right(result);
    },

    saveWaExpense: async (expenseWaDetails) => {
      const expenseDetails = await extractExpenseDataFromWa(
        expenseWaDetails,
        nlpHandler
      );
      if (isLeft(expenseDetails)) {
        if (expenseDetails.left === "userDoesNotExist") {
          const messageText = renderTemplate("UserDoesNotExistTemplate", {});
          await whatsAppHandler.sendTextMessage(
            expenseWaDetails.data.message._data.from.substring(0, 12),
            messageText
          );
        } else if (expenseDetails.left === "invalidUserMessage") {
          const messageText = renderTemplate("UserMessageNotValidTemplate", {});
          await whatsAppHandler.sendTextMessage(
            expenseWaDetails.data.message._data.from.substring(0, 12),
            messageText
          );
        }
        return right(expenseDetails.left);
      }
      const result = await repo.saveExpense(expenseDetails.right);
      expenseSaved(result);
      return right(result);
    },

    getExpenseOverview: async () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const totalExpense = await repo.getTotalExpenseForMonth(
        currentMonth,
        currentYear
      );
      const expenseTrend = await repo.getExpenseTrends();
      const categoryPercentage = await repo.getCategoryPercentage();
      return {
        totalExpense: totalExpense[0],
        expenseTrend,
        categoryPercentage,
      };
    },

    saveDummyExpenses: async () => {
      const categories = await db("expenseCategories").select("*");
      const user = await db("users")
        .select("*")
        .where({ waNumber: "918588025016" })
        .first();
      for (let j = 0; j < 20; j++) {
        const category = getRandomValueFromArray(categories);
        const min = 50;
        const max = 5000;
        const randomAm = Math.floor(Math.random() * (max - min + 1)) + min;
        const textMessage = `Spent ${randomAm} on ${category.name}`;
        await db("expenses").insert({
          userId: user.id,
          amount: randomAm,
          textMessage,
          categoryId: category.id,
        });
      }
    },
  };
}
