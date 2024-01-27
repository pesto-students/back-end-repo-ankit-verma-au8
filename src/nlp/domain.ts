export const gptSchema = {
  type: "object",
  properties: {
    amount: {
      type: "number",
      description: "The amount spent",
    },
    category: {
      type: "string",
      description: "The expense category. Eg.- Apparel, Grocery etc.",
    },
    text: {
      type: "string",
      description: "The original text passed as input",
    },
  },
  required: ["amount", "category", "text"],
};
