import * as Hapi from "@hapi/hapi";
import { isLeft, fold } from "fp-ts/lib/Either";
import * as _ from "ramda";
import { signUpSchema } from "./types";
import { USER_SIGNUP } from "./constant";

const userRouter = (server: Hapi.Server, userHandler) => {
  server.route({
    method: USER_SIGNUP.method,
    path: USER_SIGNUP.endPoint,
    options: {
      handler: async (request, h) => {
        const signUpDetails = request.payload;
        const response = await userHandler.signUpUser(signUpDetails);
        if (isLeft(response)) {
          return h.response({ message: response.left }).code(400);
        }
        return h.response({ userId: response.right }).code(201);
      },
      auth: USER_SIGNUP.auth,
      tags: USER_SIGNUP.tags,
      validate: {
        payload: signUpSchema,
        options: {
          abortEarly: true,
        },
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      plugins: {
        reCaptcha: USER_SIGNUP.reCaptcha,
      },
      description: USER_SIGNUP.description,
      notes: USER_SIGNUP.notes,
    },
  });
};

export default userRouter;
