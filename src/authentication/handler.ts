import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import { userAccountCreated, userAccountCreationFailed } from "../logEvents";
import * as repo from "./repo";
import { LoginDetail, LoginError, LoginResponse } from "./types";
import * as _ from "ramda";
import { getUserDetails } from "../../src/user/repo";
import Bcrypt from "bcrypt";

export default function authHandler(config) {
  return {
    loginUser: async (
      loginDetail: LoginDetail
    ): Promise<Either<LoginError, LoginResponse>> => {
      const result = await getUserDetails({
        waNumber: loginDetail.waNumber,
        role: loginDetail.role,
      });
      if (_.isNil(result)) {
        return left("No account exist for this number");
      }
      const match = await Bcrypt.compare(loginDetail.password, result.password);
      if (match) {
        const token = await repo.generateAuthToken(
          config.JWT_SECRET,
          result.id,
          loginDetail.role,
          loginDetail.staySignedIn ? "never" : 1
        );
        return right({ authToken: token, userId: result.id });
      } else {
        return left("Incorrect password");
      }
    },

    validateJWTToken: async (credentials, request, h) => {
      const currentSession = await repo.getSessionById(credentials.sessionId);
      if (_.isNil(currentSession)) {
        return { isValid: false };
      }
      return { isValid: true };
    },

    logoutUser: async (sessionId) => {
      await repo.deleteSession(sessionId);
    },
  };
}
