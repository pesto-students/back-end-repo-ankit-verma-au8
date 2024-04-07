import * as _ from "ramda";
import nunjucks from "nunjucks";

export type TemplateName =
  | "UserDoesNotExistTemplate"
  | "UserMessageNotValidTemplate"
  | "ExpenseSavedTemplate"
  | "BudgetReminderTemplateYellow"
  | "BudgetReminderTemplateRed"
  | "BudgetExceededReminder"
  | "WelcomeTemplate";

export const UserDoesNotExistTemplate = `Hello,
Sorry! It seems your account does not exist. Please visit https://trackpe.com to create an account.
Thanks
TrackPe team`;

export const UserMessageNotValidTemplate = `This is not a valid message. To save an expense, try posting a message like this:
1. Spent 4000 on clothes
2. 1500 on foods
3. 1000 on Petrol`;

export const ExpenseSavedTemplate = `Your expense has been saved:
Amount: {{data.amount}}
Category:{{data.category}}`;

export const BudgetReminderTemplateYellow = `You are approaching your {{categoryName}} budget limit. You are currently at {{expensePercent}} percent. Visit the dashboard for more details.`;
export const BudgetReminderTemplateRed = `You are very close to your {{categoryName}} budget limit. You are currently at {{expensePercent}} percent. Visit the dashboard for more details.`;
export const BudgetExceededReminder = `You have exceeded your {{categoryName}} budget limit. You are currently at {{expensePercent}} percent. Visit the dashboard for more details.`;
export const WelcomeTemplate = `🎉 *Welcome to WhatSpend!* 🎉

We're thrilled to have you onboard! Managing your expenses just got easier with our WhatSpend.

To track your expenses seamlessly, simply send a message like this:

"Spend [amount] on [category]"

For example: "Spend 1000 on groceries"

We'll take care of the rest and update your dashboard accordingly.

📌 *Save our WhatsApp number*: Save this WhatsApp number for easy access.

Pin this message to the top of your chat list so you can easily access it whenever you need to log an expense.

If you have any questions or need assistance, feel free to reach out anytime.

Happy tracking! 📊`;

export const AllTemplates = {
  UserDoesNotExistTemplate,
  UserMessageNotValidTemplate,
  ExpenseSavedTemplate,
  BudgetReminderTemplateYellow,
  BudgetReminderTemplateRed,
  BudgetExceededReminder,
  WelcomeTemplate,
};
