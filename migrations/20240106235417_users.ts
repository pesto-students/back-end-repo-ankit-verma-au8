import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  const query = `
    CREATE TABLE "users" (
      "id" serial PRIMARY KEY,
      "firstName" varchar,
      "lastName" varchar,
      "waNumber" varchar,
      "password" varchar,
      "email" varchar,
      "role" varchar,
      "createdAt" timestamptz DEFAULT now(),
      "updatedAt" timestamptz DEFAULT now()
    );

    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS trigger AS
    $$      
    begin
     NEW."updatedAt" = now();
     RETURN NEW;
    END;
    $$
    LANGUAGE 'plpgsql';
        
    CREATE TRIGGER users_updated
    BEFORE INSERT OR UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at();

    CREATE TABLE session (
      "sessionId" VARCHAR (50) PRIMARY KEY,
      "createdAt" timestamptz DEFAULT now(),
      "lastUsed" timestamptz DEFAULT now(),
      "userId" INT REFERENCES users(id)
    );`;

  return knex.schema.raw(query);
}

export async function down(knex: Knex): Promise<void> {
  const query = `
    DROP TABLE IF EXISTS session;
    DROP TABLE IF EXISTS users;
    `;
  return knex.schema.raw(query);
}
