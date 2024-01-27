import * as _ from "ramda";
import nunjucks from "nunjucks";

export type TemplateName =
  | "UserDoesNotExistTemplate"
  | "UserMessageNotValidTemplate";

export const UserDoesNotExistTemplate = `Hello,
Sorry! It seems your account does not exist. Please visit https://trackpe.com to create an account.
Thanks
TrackPe team`;

export const UserMessageNotValidTemplate = `This is not a valid message. To save an expense, try posting a message like this:
1. Spent 4000 on clothes
2. 1500 on foods
3. 1000 on Petrol`;

export const AllTemplates = {
  UserDoesNotExistTemplate,
  UserMessageNotValidTemplate,
};
