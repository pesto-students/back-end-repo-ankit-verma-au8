import * as Hapi from "@hapi/hapi";
import config from "../../src/config";
import { init } from "../../src/server";
import knex from "../../src/db";
import _ from "ramda";
import sinon from "sinon";

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

async function initTestServer() {
  const updateConfig = _.mergeRight(config, {
    SENTRY_DSN: undefined,
  });

  const { server, handlers } = await init(updateConfig);

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
