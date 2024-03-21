import * as _ from "ramda";
import nunjucks from "nunjucks";

export type TemplateName =
  | "UserDoesNotExistTemplate"
  | "UserMessageNotValidTemplate"
  | "ExpenseSavedTemplate"
  | "BudgetReminderTemplateYellow"
  | "BudgetReminderTemplateRed"
  | "BudgetExceededReminder";

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

export const AllTemplates = {
  UserDoesNotExistTemplate,
  UserMessageNotValidTemplate,
  ExpenseSavedTemplate,
  BudgetReminderTemplateYellow,
  BudgetReminderTemplateRed,
  BudgetExceededReminder,
};
