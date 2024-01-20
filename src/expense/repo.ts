import db from "../db";
export const saveExpense = async (expenseDetails) => {
  return await db("expenses").insert(expenseDetails).returning("*");
};
