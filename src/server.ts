import * as Hapi from "@hapi/hapi";
import * as HapiSwagger from "hapi-swagger";
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as Jwt2 from "hapi-auth-jwt2";
import _ from "ramda";
import Path from "path";
import HapiCron from "hapi-cron";
const Inert = require("@hapi/inert");
import DiagnosticRouter from "./diagnostic/router";

import userHandler from "./user/handler";
import authHandler from "./authentication/handler";
import expenseHandler from "./expense/handler";
import budgetHandler from "./budget/handler";

import UserRouter from "./user/router";
import AuthRouter from "./authentication/router";
import ExpenseRouter from "./expense/router";
import BudgetRouter from "./budget/router";
import { WhatsAppHandlerObj } from "./whatsapp/types";
import { nlpHandlerObj } from "./nlp/types";
import { logger } from "./logger";
var cron = require("node-cron");

export const init = async (
  config,
  whatsAppHandlerObj: WhatsAppHandlerObj,
  nlpHandlerObj: nlpHandlerObj
) => {
  // Hapi JS server initialization
  const server = Hapi.server({
    port: config.PORT,
    host: "0.0.0.0",
    routes: {
      files: {
        relativeTo: Path.join(__dirname, "..", "user-media"),
      },
      cors: {
        origin: ["*"],
        // an array of origins or 'ignore'
      },
    },
  });

  // Swagger configuration
  const swaggerOptions = {
    info: {
      title: "Hapi API Documentation",
      version: "0.0.1",
    },
    host: `${config.BASE_URL}`,
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [{ jwt: [] }],
  };

  // Hapi js plugins
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      plugin: Jwt2,
    },
    {
      plugin: HapiCron,
      options: {
        jobs: [
          {
            name: "Feed dummy data everyday",
            time: "0 1 * * *",
            timezone: "Asia/Kolkata",
            request: {
              method: "POST",
              url: `/expenses/user/dummy-data`,
            },
            onComplete: (res) => {
              logger.info("Completed start heater CRON, ", res);
            },
          },
        ],
      },
    },
  ]);
  const userHandlerObj = userHandler(config, whatsAppHandlerObj);
  const authHandlerObj = authHandler(config);
  const expenseHandlerObj = expenseHandler(
    config,
    whatsAppHandlerObj,
    nlpHandlerObj
  );
  const budgetHandlerObj = budgetHandler(whatsAppHandlerObj);
  //Cron jobs
  if (config.BUDGET_REMINDERS != "false") {
    cron.schedule("* * * * *", () => {
      console.log("Sending budget reminders...");
      budgetHandlerObj.sendBudgetReminder();
    });
  }
  // Authentications
  server.auth.strategy("jwt", "jwt", {
    key: config.JWT_SECRET,
    validate: authHandlerObj.validateJWTToken,
  });

  server.auth.default("jwt");

  UserRouter(server, userHandlerObj);
  AuthRouter(server, authHandlerObj);
  ExpenseRouter(server, expenseHandlerObj);
  BudgetRouter(server, budgetHandlerObj);
  DiagnosticRouter(server);
  await server.initialize();
  return {
    server,
    handlers: {},
  };
};
