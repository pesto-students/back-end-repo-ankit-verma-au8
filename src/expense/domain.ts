import { getUserDetails } from "../../src/user/repo";
import {
  Expense,
  ExtractExpenseDataFromWaError,
  InWaMessageData,
  NlpOutput,
} from "./types";
import * as _ from "ramda";
import { Either, right, left } from "fp-ts/lib/Either";
import {
  expenseSaveFailed,
  extractedExpenseFromGpt,
} from "../../src/logEvents";
import { nlpHandlerObj } from "../../src/nlp/types";
import { getCategoryDetails } from "./repo";

export const extractExpenseDataFromWa = async (
  msgData: InWaMessageData,
  nlpHandler: nlpHandlerObj
): Promise<Either<ExtractExpenseDataFromWaError, Expense>> => {
  const waNumber = msgData.data.message._data.from.substring(0, 12);
  const userText = msgData.data.message._data.body;
  const user = await getUserDetails({ waNumber });
  if (_.isNil(user)) {
    expenseSaveFailed({ reason: "userDoesNotExist", waNumber });
    return left("userDoesNotExist");
  }
  const extractedData: NlpOutput =
    await nlpHandler.extractExpenseDataFromFreeText(userText);
  if (!extractedData.amount || !extractedData.category) {
    return left("invalidUserMessage");
  }
  extractedExpenseFromGpt({
    text: userText,
    data: extractedData,
  });
  const category = await getCategoryDetails({ name: extractedData.category });
  const expenseData: Expense = {
    userId: user.id,
    amount: extractedData.amount,
    textMessage: userText,
    categoryId: category.id,
  };
  return right(expenseData);
};
