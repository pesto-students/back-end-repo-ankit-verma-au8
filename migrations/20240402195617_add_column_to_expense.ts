import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const query = 'ALTER TABLE expenses ADD COLUMN "remarks" text;';
  return knex.schema.raw(query);
}

export async function down(knex: Knex): Promise<void> {
  const query = 'ALTER TABLE expenses DROP COLUMN "remarks";';
  return knex.schema.raw(query);
}
