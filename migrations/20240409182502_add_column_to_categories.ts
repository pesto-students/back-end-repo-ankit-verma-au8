import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const query = 'ALTER TABLE "expenseCategories" ADD COLUMN "imageId" varchar;';
  return knex.schema.raw(query);
}

export async function down(knex: Knex): Promise<void> {
  const query = 'ALTER TABLE expenses DROP COLUMN "imageId";';
  return knex.schema.raw(query);
}
