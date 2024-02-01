import * as Hapi from "@hapi/hapi";
import { isLeft, fold } from "fp-ts/lib/Either";
import * as _ from "ramda";
import {
  SAVE_EXPENSE,
  SAVE_WA_EXPENSE,
  GET_EXPENSE_OVERVIEW,
  SAVE_DUMMY_EXPENSE_DATA,
  GET_USER_EXPENSES_LIST,
  GET_TOTAL_EXPENSE,
  GET_CATEGORY_PERCENTAGE,
  GET_EXPENSE_CATEGORIES,
} from "./constant";

const expenseRouter = (server: Hapi.Server, expenseHandler) => {
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

  server.route({
    method: SAVE_WA_EXPENSE.method,
    path: SAVE_WA_EXPENSE.endPoint,
    options: {
      handler: async (request, h) => {
        const expenseDetails = request.payload;
        const response = await expenseHandler.saveWaExpense({
          ...expenseDetails,
        });
        if (isLeft(response)) {
          return h.response({ message: response.left }).code(400);
        }
        return h.response(response.right).code(200);
      },
      auth: SAVE_WA_EXPENSE.auth,
      tags: SAVE_WA_EXPENSE.tags,
      plugins: {
        reCaptcha: SAVE_WA_EXPENSE.reCaptcha,
      },
      description: SAVE_WA_EXPENSE.description,
      notes: SAVE_WA_EXPENSE.notes,
    },
  });

  server.route({
    method: GET_EXPENSE_OVERVIEW.method,
    path: GET_EXPENSE_OVERVIEW.endPoint,
    options: {
      handler: async (request, h) => {
        const { limit, page } = request.query;
        const response = await expenseHandler.getExpenseTrend(limit, page);
        return h.response(response).code(200);
      },
      auth: GET_EXPENSE_OVERVIEW.auth,
      tags: GET_EXPENSE_OVERVIEW.tags,
      plugins: {
        reCaptcha: GET_EXPENSE_OVERVIEW.reCaptcha,
      },
      validate: {
        query: GET_EXPENSE_OVERVIEW.querySchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      description: GET_EXPENSE_OVERVIEW.description,
      notes: GET_EXPENSE_OVERVIEW.notes,
    },
  });

  server.route({
    method: GET_CATEGORY_PERCENTAGE.method,
    path: GET_CATEGORY_PERCENTAGE.endPoint,
    options: {
      handler: async (request, h) => {
        const { month, year } = request.query;
        const response = await expenseHandler.getCategoryPercentage(
          month,
          year
        );
        return h.response(response).code(200);
      },
      auth: GET_CATEGORY_PERCENTAGE.auth,
      tags: GET_CATEGORY_PERCENTAGE.tags,
      validate: {
        query: GET_CATEGORY_PERCENTAGE.querySchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: GET_CATEGORY_PERCENTAGE.reCaptcha,
      },
      description: GET_CATEGORY_PERCENTAGE.description,
      notes: GET_CATEGORY_PERCENTAGE.notes,
    },
  });

  server.route({
    method: GET_TOTAL_EXPENSE.method,
    path: GET_TOTAL_EXPENSE.endPoint,
    options: {
      handler: async (request, h) => {
        const { month, year } = request.query;
        const response = await expenseHandler.getTotalExpense(month, year);
        return h.response(response).code(200);
      },
      auth: GET_TOTAL_EXPENSE.auth,
      tags: GET_TOTAL_EXPENSE.tags,
      validate: {
        query: GET_TOTAL_EXPENSE.querySchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: GET_TOTAL_EXPENSE.reCaptcha,
      },
      description: GET_TOTAL_EXPENSE.description,
      notes: GET_TOTAL_EXPENSE.notes,
    },
  });

  server.route({
    method: GET_USER_EXPENSES_LIST.method,
    path: GET_USER_EXPENSES_LIST.endPoint,
    options: {
      handler: async (request, h) => {
        try {
          const { limit, page, categoryId, from, to } = request.query;
          const response = await expenseHandler.getUserExpenseList(
            request.auth.credentials.userId,
            limit,
            page,
            categoryId,
            from,
            to
          );
          return h.response(response).code(200);
        } catch (err) {
          console.log(err);
        }
      },
      auth: GET_USER_EXPENSES_LIST.auth,
      tags: GET_USER_EXPENSES_LIST.tags,
      validate: {
        query: GET_USER_EXPENSES_LIST.querySchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: GET_USER_EXPENSES_LIST.reCaptcha,
      },
      description: GET_USER_EXPENSES_LIST.description,
      notes: GET_USER_EXPENSES_LIST.notes,
    },
  });

  server.route({
    method: SAVE_DUMMY_EXPENSE_DATA.method,
    path: SAVE_DUMMY_EXPENSE_DATA.endPoint,
    options: {
      handler: async (request, h) => {
        await expenseHandler.saveDummyExpenses();
        return h.response({}).code(200);
      },
      auth: SAVE_DUMMY_EXPENSE_DATA.auth,
      tags: SAVE_DUMMY_EXPENSE_DATA.tags,
      plugins: {
        reCaptcha: SAVE_DUMMY_EXPENSE_DATA.reCaptcha,
      },
      description: SAVE_DUMMY_EXPENSE_DATA.description,
      notes: SAVE_DUMMY_EXPENSE_DATA.notes,
    },
  });

  server.route({
    method: GET_EXPENSE_CATEGORIES.method,
    path: GET_EXPENSE_CATEGORIES.endPoint,
    options: {
      handler: async (request, h) => {
        const response = await expenseHandler.getExpenseCategories();
        return h.response(response).code(200);
      },
      auth: GET_EXPENSE_CATEGORIES.auth,
      tags: GET_EXPENSE_CATEGORIES.tags,
      plugins: {
        reCaptcha: GET_EXPENSE_CATEGORIES.reCaptcha,
      },
      description: GET_EXPENSE_CATEGORIES.description,
      notes: GET_EXPENSE_CATEGORIES.notes,
    },
  });
};

export default expenseRouter;
