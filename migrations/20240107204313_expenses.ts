import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const query = `
    CREATE TABLE "expenses" (
      "id" serial PRIMARY KEY,
      "userId" INT REFERENCES users(id),
      "amount" NUMERIC,
      "textMessage" TEXT,
      "category" VARCHAR,
      "createdAt" timestamptz
    );`;
  return knex.schema.raw(query);
}

export async function down(knex: Knex): Promise<void> {
  const query = `
    DROP TABLE IF EXISTS expenses;
    `;
  return knex.schema.raw(query);
}
