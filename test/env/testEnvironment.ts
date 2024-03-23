import * as Hapi from "@hapi/hapi";
import config from "../../src/config";
import { init } from "../../src/server";
import knex from "../../src/db";
import _ from "ramda";
import sinon from "sinon";
import { WhatsAppHandlerObj } from "../../src/whatsapp/types";
import { right } from "fp-ts/lib/Either";
import { nlpHandlerObj } from "../../src/nlp/types";
import nlpHandler from "src/nlp/handler";

var testEnv: undefined | any;

async function resetDB() {
  try {
    const query = `
      truncate table users, session, expenses CASCADE;
      `;
    return knex.schema.raw(query);
  } catch (e) {
    console.log(e);
  }
}
export const dummyWhatsAppHandler: WhatsAppHandlerObj = {
  sendTextMessage: async (whatsAppNumber: string, textMessage: string) => {},
};

export const dummyNlpHandlerObj: nlpHandlerObj = {
  extractExpenseDataFromFreeText: (textMessage: string) => {
    return {
      expenses: [
        {
          amount: 50,
          category: "Entertainment",
          text: textMessage,
        },
      ],
    };
  },
};

async function initTestServer() {
  const updateConfig = _.mergeRight(config, {
    SENTRY_DSN: undefined,
  });

  const { server, handlers } = await init(
    updateConfig,
    dummyWhatsAppHandler,
    dummyNlpHandlerObj
  );

  await knex.migrate.rollback();
  await knex.migrate.latest();

  return {
    server,
    resetDB: resetDB,
  };
}

export async function getTestEnv() {
  if (testEnv === undefined) {
    testEnv = await initTestServer();
  }
  return testEnv;
}
