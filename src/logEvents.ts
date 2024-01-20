import { logger } from "./logger";
import _ from "ramda";
import { level } from "winston";

export type GeneralEvents = "file-uploaded";

export type UserEvents =
  | "user-account-created"
  | "user-account-creation-failed"
  | "user-login-successful"
  | "user-login-failed";

export type MqEvents = "mq-connection-failed" | "mq-connection-created";

export type ExpenseEvents = "expense-saved";

export type EventName = GeneralEvents | UserEvents | MqEvents | ExpenseEvents;

export function logEvent(
  eventName: EventName,
  eventData: any,
  level: string = "info"
) {
  logger.log(level, { eventName, eventData });
}

export function fileUploadedEvent(fileDetails) {
  logEvent("file-uploaded", { fileDetails });
}

// User events

export function userAccountCreated(userDetails) {
  logEvent("user-account-created", userDetails);
}

export function userAccountCreationFailed(userDetails) {
  logEvent("user-account-creation-failed", userDetails);
}

export function userLoggedInEvent(userId) {
  logEvent("user-login-successful", { userId: userId });
}

export function userLoggedInFailed(reason) {
  logEvent("user-login-failed", { reason });
}

// Mq Events

export function mqConnectionFailed(reason) {
  logEvent("mq-connection-failed", { reason });
}

export function mqConnectionCreated(data = null) {
  logEvent("mq-connection-created", data);
}

//Expense events

export function expenseSaved(data) {
  logEvent("expense-saved", data);
}
