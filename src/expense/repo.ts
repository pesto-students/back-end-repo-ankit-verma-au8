import db from "../db";
export const saveExpense = async (expenseDetails) => {
  return await db("expenses").insert(expenseDetails).returning("*");
};

export const getCategoryDetails = async (q) => {
  return await db("expenseCategories").select("*").where(q).first();
};

export const getTotalExpenseForMonth = async (userId, month, year) => {
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
      AND "expenses"."userId" = :userId
  GROUP BY 
    year, month;
      `;
  return await db.raw(query, { userId, month, year }).then((r) => {
    return r.rows;
  });
};

export const getCategoryPercentage = async (userId, month, year) => {
  const query = `
  SELECT
  "categoryId",
  "expenseCategories"."name" AS "categoryName",
  SUM("amount") AS "totalExpense"
  FROM
    "expenses"
    JOIN "expenseCategories" ON "expenses"."categoryId" = "expenseCategories"."id"
  WHERE
    EXTRACT(MONTH FROM "createdAt") = :month AND EXTRACT(YEAR FROM "createdAt") = :year AND "expenses"."userId" = :userId
  GROUP BY
    "categoryId", "categoryName";
  `;
  return await db.raw(query, { month, year, userId }).then((r) => {
    return r.rows;
  });
};

export const getUserExpenseList = async (
  userId,
  limit,
  offset,
  categoryId,
  from,
  to
) => {
  console.log({ from, to });
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
    "users"."id" = :userId ${categoryId ? 'AND "categoryId"=:categoryId' : ""}${
    from ? ' AND expenses."createdAt"::date >= :from' : ""
  } ${to ? ' AND expenses."createdAt"::date <= :to' : ""}
  ORDER BY
    "expenses"."createdAt" DESC
  LIMIT :limit
  OFFSET :offset;
;
  `;
  return await db
    .raw(query, { userId, limit, offset: offset * limit, categoryId, from, to })
    .then((r) => {
      return r.rows;
    });
};

export const getUserExpenseCount = async (userId, categoryId, from, to) => {
  const query = `
  SELECT
    COUNT(*) AS "totalCount"
  FROM
    "expenses"
    JOIN "users" ON "expenses"."userId" = "users"."id"
    JOIN "expenseCategories" ON "expenses"."categoryId" = "expenseCategories"."id"
  WHERE
    "users"."id" = :userId ${categoryId ? 'AND "categoryId"=:categoryId' : ""}${
    from ? ' AND expenses."createdAt"::date >= :from' : ""
  } ${to ? ' AND expenses."createdAt"::date <= :to' : ""};
  `;

  return await db.raw(query, { userId, categoryId, from, to }).then((r) => {
    return r.rows[0];
  });
};

export const getUserExpenseSum = async (userId, categoryId, from, to) => {
  const query = `
  SELECT
    SUM("amount") AS "totalExpense"
  FROM
    "expenses"
    JOIN "users" ON "expenses"."userId" = "users"."id"
    JOIN "expenseCategories" ON "expenses"."categoryId" = "expenseCategories"."id"
  WHERE
    "users"."id" = :userId ${categoryId ? 'AND "categoryId"=:categoryId' : ""}${
    from ? ' AND expenses."createdAt"::date >= :from' : ""
  } ${to ? ' AND expenses."createdAt"::date <= :to' : ""};
  `;

  return await db.raw(query, { userId, categoryId, from, to }).then((r) => {
    return r.rows[0];
  });
};

export const getExpenseCategory = async (q) => {
  return await db("expenseCategories").select("*").where(q);
};

export async function getTotalExpenseForCategory(
  userId,
  categoryId,
  from,
  to
): Promise<Array<{ categoryName: string; totalExpense: number }>> {
  const query = `
  SELECT
  "expenseCategories"."name" AS "categoryName",
  COALESCE(SUM("expenses"."amount"), 0) AS "totalExpense"
  FROM
    "expenseCategories"
  LEFT JOIN "expenses" ON "expenses"."categoryId" = "expenseCategories"."id"
                      AND "expenses"."userId" = :userId
                      AND "expenses"."createdAt"::date BETWEEN :from AND :to
                      AND "expenses"."categoryId" = :categoryId
  LEFT JOIN "users" ON "expenses"."userId" = "users"."id"
  WHERE
    "expenseCategories"."id" = :categoryId
  GROUP BY
    "expenseCategories"."name";
  `;

  return await db.raw(query, { userId, categoryId, from, to }).then((r) => {
    return r.rows;
  });
}

export const getCategoryExpenses = async (startDate, endDate, userId) => {
  const query = `
    SELECT ec.name AS "categoryName", COALESCE(SUM(e.amount), 0) AS "totalExpense"
    FROM "expenses" e
    RIGHT JOIN "expenseCategories" ec ON e."categoryId" = ec.id
    WHERE e."createdAt"::date >= :endDate and e."createdAt"::date <= :startDate AND e."userId" = :userId
    GROUP BY ec.name;
  `;
  return await db.raw(query, { startDate, endDate, userId }).then((r) => {
    return r.rows;
  });
};
