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

export type ExpenseEvents = "expense-saved" | "save-expense-failed";
export type BudgetEvents =
  | "budget-saved"
  | "budget-updated"
  | "save-budget-failed";

export type GptEvents = "gpt-expense-extracted";

export type whatsAppEvents =
  | "whatsApp-message-sent"
  | "whatsApp-media-sent"
  | "sending-media-failed"
  | "sending-message-failed";

export type EventName =
  | GeneralEvents
  | UserEvents
  | MqEvents
  | ExpenseEvents
  | whatsAppEvents
  | GptEvents
  | BudgetEvents;

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

export function expenseSaveFailed(data) {
  logEvent("save-expense-failed", data);
}

// Whatsapp events

export function messageSent(data) {
  logEvent("whatsApp-message-sent", data);
}

export function mediaSent(data) {
  logEvent("whatsApp-media-sent", data);
}

export function messageSendingFailed(data) {
  logEvent("sending-message-failed", data);
}

export function mediaSendingFailed(data) {
  logEvent("sending-media-failed", data);
}

//Gpt Events

export function extractedExpenseFromGpt(data) {
  logEvent("gpt-expense-extracted", data);
}

//Budget events

export function budgetSaved(data) {
  logEvent("budget-saved", data);
}

export function budgetUpdated(data) {
  logEvent("budget-updated", data);
}

export function saveBudgetFailed(data) {
  logEvent("budget-updated", data);
}
