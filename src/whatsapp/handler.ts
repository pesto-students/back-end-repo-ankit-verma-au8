import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { WhatsAppHandlerObj } from "./types";
import axios from "axios";
import { messageSendingFailed, messageSent } from "../../src/logEvents";
import api from "api";

export default function whatsAppHandler(config): WhatsAppHandlerObj {
  const wapiSdk = api("@waapi/v1.0#djytglrizqpcs");
  wapiSdk.auth(config.WAPI_API_KEY);

  return {
    sendTextMessage: async (whatsAppNumber: string, textMessage: string) => {
      const msgData = {
        chatId: `${whatsAppNumber}@c.us`,
        message: textMessage,
      };
      try {
        await wapiSdk.postInstancesIdClientActionSendMessage(
          {
            chatId: msgData.chatId,
            message: msgData.message,
          },
          { id: config.WAPI_INSTANCE_ID }
        );
        messageSent(msgData);
      } catch (error) {
        messageSendingFailed(whatsAppNumber);
        return left("errorInSendingMessage");
      }
    },
  };
}
