import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import {
  expenseSaveFailed,
  expenseSaved,
  extractedExpenseFromGpt,
} from "../logEvents";
import * as repo from "./repo";
import {
  Expense,
  ExpenseSaveResponse,
  ExtractExpenseDataFromWaError,
  NlpOutput,
  TrendsInterval,
} from "./types";
import { WhatsAppHandlerObj } from "../../src/whatsapp/types";
import { renderTemplate } from "../../src/whatsapp/domain";
import { nlpHandlerObj } from "../../src/nlp/types";
import { getRandomValueFromArray } from "../../test/env/factories";
import db from "../db";
import * as _ from "ramda";
import { getUserDetails } from "../../src/user/repo";
import { calculateTotalAmount, generateDates } from "./domain";

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

    saveWaExpense: async (msgData) => {
      try {
        const waNumber = msgData.data.message._data.from.substring(0, 12);
        const userText = msgData.data.message._data.body;
        const user = await getUserDetails({ waNumber });
        if (_.isNil(user)) {
          expenseSaveFailed({ reason: "userDoesNotExist", waNumber });
          const messageText = renderTemplate("UserDoesNotExistTemplate", {});
          await whatsAppHandler.sendTextMessage(waNumber, messageText);
          return right("User does not exist");
        }

        const extractedData: NlpOutput =
          await nlpHandler.extractExpenseDataFromFreeText(userText);
        if (
          !extractedData.expenses[0].amount ||
          !extractedData.expenses[0].category
        ) {
          const messageText = renderTemplate("UserMessageNotValidTemplate", {});
          await whatsAppHandler.sendTextMessage(
            msgData.data.message._data.from.substring(0, 12),
            messageText
          );
          return right("User message is not valid");
        }
        extractedExpenseFromGpt({
          text: userText,
          data: extractedData,
        });
        for (let value of extractedData.expenses) {
          const category = await repo.getCategoryDetails({
            name: value.category,
          });
          const expenseData: Expense = {
            userId: user.id,
            amount: value.amount,
            textMessage: value.text,
            categoryId: category.id,
          };
          await repo.saveExpense(expenseData);
          expenseSaved(expenseData);
          const messageText = renderTemplate("ExpenseSavedTemplate", {
            data: {
              amount: expenseData.amount,
              category: value.category,
            },
          });
          await whatsAppHandler.sendTextMessage(waNumber, messageText);
        }
        return right("Expense(s) saved Successfully");
      } catch (e) {
        console.log(e);
      }
    },

    getUserExpenseList: async (userId, limit, page, categoryId, from, to) => {
      const result = await repo.getUserExpenseList(
        userId,
        limit,
        page - 1,
        categoryId,
        from,
        to
      );
      const { totalCount } = await repo.getUserExpenseCount(
        userId,
        categoryId,
        from,
        to
      );
      const totalExpense = await calculateTotalAmount(result);
      return { data: result, totalCount, totalExpense };
    },

    getTotalExpense: async (userId, month = null, year = null) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const totalExpense = await repo.getTotalExpenseForMonth(
        userId,
        month ? month : currentMonth,
        year ? year : currentYear
      );
      if (totalExpense.length == 0) {
        return {
          totalExpense: [
            {
              month,
              year,
              totalAmount: 0,
            },
          ],
        };
      }
      return { totalExpense };
    },

    getExpenseTrend: async (userId, interval: TrendsInterval) => {
      const dates = generateDates(interval);
      const result: any = [];
      for (let value of dates) {
        const data = await repo.getCategoryExpenses(
          value.startDate,
          value.endDate,
          userId
        );
        result.push({ ...value, data });
      }
      return result;
    },

    getCategoryPercentage: async (userId, month, year) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const categoryPercentage = await repo.getCategoryPercentage(
        userId,
        month ? month : currentMonth,
        year ? year : currentYear
      );
      return {
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

    getExpenseCategories: async () => {
      const result = await repo.getExpenseCategory({});
      return result;
    },
  };
}
