import * as Hapi from "@hapi/hapi";
import { isLeft } from "fp-ts/lib/Either";
import * as _ from "ramda";
import {
  loginResponseSchema,
  loginSchema,
  logoutResponseSchema,
} from "./types";
import { AUTH_LOGOUT, AUTH_LOGIN } from "./constant";

const authenticationRouter = (server: Hapi.Server, authHandler) => {
  server.route({
    method: AUTH_LOGIN.method,
    path: AUTH_LOGIN.endPoint,
    options: {
      handler: async (request, h) => {
        try {
          const authDetails = request.payload;
          const response = await authHandler.loginUser(authDetails);
          if (isLeft(response)) {
            return h.response({ errors: response.left }).code(400);
          }
          return h.response(response.right).code(200);
        } catch (err) {
          console.log(err);
        }
      },
      auth: AUTH_LOGIN.auth,
      tags: AUTH_LOGIN.tags,
      validate: {
        payload: loginSchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      response: {
        sample: 40,
        schema: loginResponseSchema,
        failAction: AUTH_LOGIN.failAction,
      },
      plugins: {
        reCaptcha: AUTH_LOGIN.reCaptcha,
      },
      description: AUTH_LOGIN.description,
      notes: AUTH_LOGIN.notes,
    },
  });

  server.route({
    method: AUTH_LOGOUT.method,
    path: AUTH_LOGOUT.endPoint,
    options: {
      handler: async (request, h) => {
        await authHandler.logoutUser(request.auth.credentials.sessionId);
        return h.response({}).code(200);
      },
      auth: AUTH_LOGOUT.auth,
      tags: AUTH_LOGOUT.tags,
      validate: {
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      response: {
        sample: 40,
        schema: logoutResponseSchema,
        failAction: AUTH_LOGOUT.failAction,
      },
      plugins: {
        reCaptcha: AUTH_LOGOUT.reCaptcha,
      },
      description: AUTH_LOGOUT.description,
      notes: AUTH_LOGOUT.notes,
    },
  });
};

export default authenticationRouter;
