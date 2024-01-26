import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import { expenseSaved } from "../logEvents";
import * as repo from "./repo";
import { Expense } from "./types";
import { extractExpenseDataFromWa } from "./domain";
import { WhatsAppHandlerObj } from "../../src/whatsapp/types";
import { renderTemplate } from "src/whatsapp/domain";

export default function expenseHandler(
  config,
  whatsAppHandler: WhatsAppHandlerObj
) {
  return {
    saveExpense: async (expenseDetails: Expense) => {
      const result = await repo.saveExpense(expenseDetails);
      expenseSaved(result);
      return right(result);
    },

    saveWaExpense: async (expenseWaDetails) => {
      const expenseDetails = await extractExpenseDataFromWa(expenseWaDetails);
      if (isLeft(expenseDetails)) {
        const messageText = renderTemplate("UserDoesNotExistTemplate", {});
        await whatsAppHandler.sendTextMessage(
          expenseWaDetails.data.message._data.from.substring(0, 12),
          messageText
        );
        return right(expenseDetails.left);
      }
      const result = await repo.saveExpense(expenseDetails.right);
      expenseSaved(result);
      return right(result);
    },
  };
}
