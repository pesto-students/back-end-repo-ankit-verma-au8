import nlpHandler from "./handler";
import config from "../../src/config";

const nlpHandlerObj = nlpHandler(config);

(async () => {
  const result = await nlpHandlerObj.extractExpenseDataFromFreeText("Hi");
  console.log(JSON.stringify(result));
})();
