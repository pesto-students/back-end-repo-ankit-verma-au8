import { Either, isLeft, right, left } from "fp-ts/lib/Either";
import { userAccountCreated, userAccountCreationFailed } from "../logEvents";
import * as repo from "./repo";
import { SaveUserError, User, UserId } from "./types";
import jwt from "jsonwebtoken";
import { WhatsAppHandlerObj } from "../whatsapp/types";
import { renderTemplate } from "../whatsapp/domain";

export default function userHandler(
  config,
  whatsAppHandler: WhatsAppHandlerObj
) {
  return {
    signUpUser: async (
      signUpDetails: User
    ): Promise<Either<SaveUserError, UserId>> => {
      const result = await repo.saveUserDetails({
        ...signUpDetails,
        role: "user",
      });
      if (isLeft(result)) {
        userAccountCreationFailed({
          email: signUpDetails.waNumber,
          reason: result.left,
        });
        return result;
      }
      const userId = result.right;
      userAccountCreated({
        id: userId,
        waNumber: signUpDetails.waNumber,
      });
      const messageText = renderTemplate("WelcomeTemplate", {});
      await whatsAppHandler.sendTextMessage(
        signUpDetails.waNumber,
        messageText
      );
      return right(userId);
    },
  };
}
