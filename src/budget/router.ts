import * as Hapi from "@hapi/hapi";
import { isLeft, fold } from "fp-ts/lib/Either";
import * as _ from "ramda";
import {
  SAVE_BUDGET,
  UPDATE_BUDGET,
  GET_BUDGET,
  DELETE_BUDGET,
} from "./constant";

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
        return h.response(response.right).code(200);
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

  server.route({
    method: DELETE_BUDGET.method,
    path: DELETE_BUDGET.endPoint,
    options: {
      handler: async (request, h) => {
        const budgetDetails = request.payload;
        const response = await budgetHandler.deleteBudget(request.params.id);
        if (isLeft(response)) {
          return h.response({ message: response.left }).code(400);
        }
        return h.response(response.right).code(200);
      },
      auth: DELETE_BUDGET.auth,
      tags: DELETE_BUDGET.tags,
      validate: {
        params: DELETE_BUDGET.paramSchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: DELETE_BUDGET.reCaptcha,
      },
      description: DELETE_BUDGET.description,
      notes: DELETE_BUDGET.notes,
    },
  });

  server.route({
    method: GET_BUDGET.method,
    path: GET_BUDGET.endPoint,
    options: {
      handler: async (request, h) => {
        const response = await budgetHandler.getBudget(
          request.auth.credentials.userId
        );
        if (isLeft(response)) {
          return h.response({ message: response.left }).code(400);
        }
        return h.response(response.right).code(200);
      },
      auth: GET_BUDGET.auth,
      tags: GET_BUDGET.tags,
      plugins: {
        reCaptcha: GET_BUDGET.reCaptcha,
      },
      description: GET_BUDGET.description,
      notes: GET_BUDGET.notes,
    },
  });
};

export default budgetRouter;
