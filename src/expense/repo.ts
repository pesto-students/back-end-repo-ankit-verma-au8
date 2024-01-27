import db from "../db";
export const saveExpense = async (expenseDetails) => {
  return await db("expenses").insert(expenseDetails).returning("*");
};

export const getCategoryDetails = async (q) => {
  return await db("expenseCategories").select("*").where(q).first();
};
