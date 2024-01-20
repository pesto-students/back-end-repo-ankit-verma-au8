import * as Hapi from "@hapi/hapi";
import { isLeft, fold } from "fp-ts/lib/Either";
import * as _ from "ramda";
import { SAVE_EXPENSE } from "./constant";

const userRouter = (server: Hapi.Server, expenseHandler) => {
  server.route({
    method: SAVE_EXPENSE.method,
    path: SAVE_EXPENSE.endPoint,
    options: {
      handler: async (request, h) => {
        const expenseDetails = request.payload;
        const response = await expenseHandler.saveExpense({
          ...expenseDetails,
          userId: request.auth.credentials.userId,
        });
        if (isLeft(response)) {
          return h.response({ message: response.left }).code(400);
        }
        return h.response(response.right).code(201);
      },
      auth: SAVE_EXPENSE.auth,
      tags: SAVE_EXPENSE.tags,
      validate: {
        payload: SAVE_EXPENSE.payloadSchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: SAVE_EXPENSE.reCaptcha,
      },
      description: SAVE_EXPENSE.description,
      notes: SAVE_EXPENSE.notes,
    },
  });
};

export default userRouter;
