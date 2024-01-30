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

export const getExpenseTrends = async () => {
  const query = `
  WITH RECURSIVE date_series AS (
    SELECT generate_series(
             CURRENT_DATE - INTERVAL '8 days',
             CURRENT_DATE,
             INTERVAL '1 day'
           )::DATE AS date
  )
  SELECT
    to_char(ds.date, 'YYYY-MM-DD') AS formatted_date,
    COALESCE(json_agg(e.expense), '[]'::json) AS expenses
  FROM
    date_series ds
  LEFT JOIN (
    SELECT
      e."createdAt"::DATE AS date,
      jsonb_build_object('category', ec."name", 'totalExepense', SUM(e."amount")) AS expense
    FROM
      "expenses" e
      JOIN "expenseCategories" ec ON e."categoryId" = ec."id"
    WHERE
      e."createdAt"::DATE >= CURRENT_DATE - INTERVAL '8 days'
      AND e."createdAt"::DATE <= CURRENT_DATE
    GROUP BY
      e."createdAt"::DATE,
      ec."name"
  ) e ON ds.date = e.date
  GROUP BY
    ds.date
  ORDER BY
    ds.date DESC;
  `;
  return await db.raw(query).then((r) => {
    return r.rows;
  });
};

export const getCategoryPercentage = async (month, year) => {
  const query = `
  SELECT
  "categoryId",
  "expenseCategories"."name" AS "categoryName",
  SUM("amount") AS "totalExpense"
  FROM
    "expenses"
    JOIN "expenseCategories" ON "expenses"."categoryId" = "expenseCategories"."id"
  WHERE
    EXTRACT(MONTH FROM "createdAt") = :month AND EXTRACT(YEAR FROM "createdAt") = :year
  GROUP BY
    "categoryId", "categoryName";
  `;
  return await db.raw(query, { month, year }).then((r) => {
    return r.rows;
  });
};

export const getUserExpenseList = async (userId, limit, offset) => {
  const query = `
  SELECT
    expenses.id,
    "amount",
    "textMessage",
    "expenseCategories"."name" AS "categoryName",
    expenses."createdAt"
  FROM
    "expenses"
    JOIN "users" ON "expenses"."userId" = "users"."id"
    JOIN "expenseCategories" ON "expenses"."categoryId" = "expenseCategories"."id"
  WHERE
    "users"."id" = :userId
  ORDER BY
    "expenses"."createdAt" DESC
  LIMIT :limit
  OFFSET :offset;
;
  `;
  return await db.raw(query, { userId, limit, offset }).then((r) => {
    return r.rows;
  });
};
