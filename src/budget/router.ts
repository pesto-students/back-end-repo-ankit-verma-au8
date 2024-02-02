import * as Hapi from "@hapi/hapi";
import { isLeft, fold } from "fp-ts/lib/Either";
import * as _ from "ramda";
import { SAVE_BUDGET, UPDATE_BUDGET } from "./constant";

const budgetRouter = (server: Hapi.Server, budgetHandler) => {
  server.route({
    method: SAVE_BUDGET.method,
    path: SAVE_BUDGET.endPoint,
    options: {
      handler: async (request, h) => {
        const budgetDetails = request.payload;
        const response = await budgetHandler.saveBudget({
          ...budgetDetails,
          userId: request.auth.credentials.userId,
        });
        if (isLeft(response)) {
          return h.response({ message: response.left }).code(400);
        }
        return h.response(response.right).code(201);
      },
      auth: SAVE_BUDGET.auth,
      tags: SAVE_BUDGET.tags,
      validate: {
        payload: SAVE_BUDGET.payloadSchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: SAVE_BUDGET.reCaptcha,
      },
      description: SAVE_BUDGET.description,
      notes: SAVE_BUDGET.notes,
    },
  });

  server.route({
    method: UPDATE_BUDGET.method,
    path: UPDATE_BUDGET.endPoint,
    options: {
      handler: async (request, h) => {
        const budgetDetails = request.payload;
        const response = await budgetHandler.updateBudget(
          {
            ...budgetDetails,
            userId: request.auth.credentials.userId,
          },
          request.params.id
        );
        if (isLeft(response)) {
          return h.response({ message: response.left }).code(400);
        }
        return h.response(response.right).code(201);
      },
      auth: UPDATE_BUDGET.auth,
      tags: UPDATE_BUDGET.tags,
      validate: {
        payload: UPDATE_BUDGET.payloadSchema,
        params: UPDATE_BUDGET.paramSchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: UPDATE_BUDGET.reCaptcha,
      },
      description: UPDATE_BUDGET.description,
      notes: UPDATE_BUDGET.notes,
    },
  });
};

export default budgetRouter;
