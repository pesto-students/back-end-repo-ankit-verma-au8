import * as _ from "ramda";
import nunjucks from "nunjucks";

export type TemplateName = "UserDoesNotExistTemplate";

export const UserDoesNotExistTemplate = `Hello,
Sorry! It seems your account does not exist. Please visit https://trackpe.com to create an account.
Thanks
TrackPe team`;

export const AllTemplates = {
  UserDoesNotExistTemplate,
};
