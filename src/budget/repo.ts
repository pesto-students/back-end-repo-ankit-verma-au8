import db from "../db";

export const saveBudget = async (budgetDetails) => {
  return await db("budgets").insert(budgetDetails).returning("*");
};

export const updateBudget = async (budgetDetails, q) => {
  return await db("budgets").update(budgetDetails).where(q).returning("*");
};

export const getBudgetDetails = async (q) => {
  return await db("budgets").select("*").where(q).first();
};

export const getBudgetsList = async (q) => {
  return await db("budgets").select("*").where(q);
};
