import { logger } from "./logger";
import _ from "ramda";
import { level } from "winston";

export type GeneralEvents = "file-uploaded";

export type UserEvents =
  | "user-account-created"
  | "user-account-creation-failed"
  | "user-login-successful"
  | "user-login-failed";

export type CalculatorEvents = "footprint-calculated";

export type StripeEvents = "stripe-account-created";

export type LandscapeEvents = "landscape-created" | "landscape-updated";

export type MailchimpEvents =
  | "subscribed-to-newsletter"
  | "newsletter-subscription-failed"
  | "mailchimp-language-updated";

export type EventName =
  | GeneralEvents
  | UserEvents
  | CalculatorEvents
  | LandscapeEvents
  | MailchimpEvents;

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

// Landscape function

export function landscapeCreatedEvent(id, landscapeName, metadata) {
  logEvent("landscape-created", { id, landscapeName, metadata });
}

// Calculator

export function footPrintCalculated(userAnswer, result) {
  logEvent("footprint-calculated", { userAnswer, result });
}

// Mail chimp

export function subscribedToNewsLetter(details) {
  logEvent("subscribed-to-newsletter", details);
}

export function mailchimpSubscriptionFailed(subscriberInfo, error) {
  logEvent(
    "newsletter-subscription-failed",
    { subscriberInfo, error },
    "error"
  );
}

export function mailchimpLanguageUpdated(email, language) {
  logEvent("mailchimp-language-updated", { email, language });
}
