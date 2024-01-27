import db from "../db";
export const saveExpense = async (expenseDetails) => {
  return await db("expenses").insert(expenseDetails).returning("*");
};

export const getCategoryDetails = async (q) => {
  return await db("expenseCategories").select("*").where(q).first();
};

export const getTotalExpenseForMonth = async (month, year) => {
  const query = `
  SELECT 
    EXTRACT(MONTH FROM "createdAt") AS month,
    EXTRACT(YEAR FROM "createdAt") AS year,
    SUM("amount") AS "totalAmount"
  FROM 
      "expenses"
  WHERE 
      EXTRACT(MONTH FROM "createdAt") = :month
      AND EXTRACT(YEAR FROM "createdAt") = :year
  GROUP BY 
    year, month;
      `;
  return await db.raw(query, { month, year }).then((r) => {
    return r.rows;
  });
};
