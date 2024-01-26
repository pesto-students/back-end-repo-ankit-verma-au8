import { getUserDetails } from "../../src/user/repo";
import {
  Expense,
  ExtractExpenseDataFromWaError,
  InWaMessageData,
} from "./types";
import * as _ from "ramda";
import { Either, right, left } from "fp-ts/lib/Either";
import { expenseSaveFailed } from "../../src/logEvents";

export const extractExpenseDataFromWa = async (
  msgData: InWaMessageData
): Promise<Either<ExtractExpenseDataFromWaError, Expense>> => {
  const waNumber = msgData.data.message._data.from.substring(0, 12);
  const user = await getUserDetails({ waNumber });
  if (_.isNil(user)) {
    expenseSaveFailed({ reason: "userDoesNotExist", waNumber });
    return left("userDoesNotExist");
  }
  const expenseData: Expense = {
    userId: user.id,
    amount: 50,
    textMessage: msgData.data.message._data.body,
    categoryId: 1,
  };
  return right(expenseData);
};
