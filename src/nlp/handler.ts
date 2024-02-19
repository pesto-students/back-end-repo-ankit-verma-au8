import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { nlpHandlerObj } from "./types";
import OpenAI from "openai";
import { gptSchema } from "./domain";

export default function nlpHandler(config): nlpHandlerObj {
  const openai = new OpenAI({
    apiKey: config.GPT_API_KEY,
  });

  return {
    extractExpenseDataFromFreeText: async (textMessage: string) => {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "system",
            content: `You are a assistant which will convert the free text to structured 
            expense array of objects. Eg.- 'Spent 1000 Rs. to Clothes' will be converted to [{amount:1000, 
              category: 'Clothing', text:'Spent 1000 Rs. to Clothes'}], 'Spent 1000 Rs. to Clothes, spent 2000 on patrol' will be converted to [{amount:1000, 
                category: 'Clothing', text:'Spent 1000 Rs. to Clothes'}, {amount:2000, 
                  category: 'Transportation', text:'Spent 2000 on patrol'}]
            You should use only these categories - ['Food/Drinks', 'Clothing', 'Technology', 
            'Transportation', 'Gifts', 'Entertainment', 'Books/Magazine', 'Education', 'Sports', 'Pets', 'Travel'],`,
          },
          {
            role: "user",
            content: `Give me structured object for : ${textMessage}`,
          },
        ],
        functions: [{ name: "get_expense_data", parameters: gptSchema }],
        function_call: { name: "get_expense_data" },
        temperature: 0,
      });

      const op = response.choices[0].message.function_call?.arguments;
      if (op) {
        return JSON.parse(op);
      }
    },
  };
}
