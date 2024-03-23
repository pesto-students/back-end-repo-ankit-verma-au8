import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const query = `
    CREATE TABLE "budgets" (
      "id" serial PRIMARY KEY,
      "userId" INT REFERENCES users(id),
      "amount" NUMERIC,
      "categoryId" INT references "expenseCategories"(id),
      "createdAt" timestamptz DEFAULT now(),
      "reminders" BOOLEAN DEFAULT false
    );`;
  return knex.schema.raw(query);
}

export async function down(knex: Knex): Promise<void> {
  const query = `
    DROP TABLE IF EXISTS budgets;
    `;
  return knex.schema.raw(query);
}
