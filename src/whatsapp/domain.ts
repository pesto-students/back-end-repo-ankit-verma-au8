import * as _ from "ramda";
import nunjucks from "nunjucks";
import { AllTemplates, TemplateName } from "./templates";

export const renderTemplate = (templateName: TemplateName, data) => {
  return nunjucks.renderString(AllTemplates[templateName], data);
};
