import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const query = `
  CREATE TABLE "expenseCategories"
    (
        "id" serial PRIMARY KEY,
        "name" VARCHAR UNIQUE
    );
    INSERT INTO "expenseCategories"
    (name)
    VALUES
    ('Food/Drinks'),
    ('Clothing'),
    ('Technology'),
    ('Transportation'),
    ('Gifts'),
    ('Entertainment'),
    ('Books/Magazine'),
    ('Education'),
    ('Sports'),
    ('Pets'),
    ('Travel');

    CREATE TABLE "expenses" (
      "id" serial PRIMARY KEY,
      "userId" INT REFERENCES users(id),
      "amount" NUMERIC,
      "textMessage" TEXT,
      "categoryId" INT references "expenseCategories"(id),
      "createdAt" timestamptz
    );`;
  return knex.schema.raw(query);
}

export async function down(knex: Knex): Promise<void> {
  const query = `
    DROP TABLE IF EXISTS expenses;
    DROP TABLE IF EXISTS "expenseCategories";
    `;
  return knex.schema.raw(query);
}
