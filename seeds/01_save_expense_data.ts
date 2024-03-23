import * as Knex from "knex";
import { getRandomValueFromArray } from "../test/env/factories";

export async function seed(knex: Knex): Promise<void> {
  const categories = await knex("expenseCategories").select("*");

  const user = await knex("users")
    .select("*")
    .where({ waNumber: "918588025016" })
    .first();
  for (let i = 0; i < 25; i++) {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - i);
    const randomTimestampYesterday =
      yesterday.getTime() + Math.floor(Math.random() * 86400000);
    for (let j = 0; j < 20; j++) {
      const category = getRandomValueFromArray(categories);
      const min = 50;
      const max = 5000;
      const randomAm = Math.floor(Math.random() * (max - min + 1)) + min;
      const textMessage = `Spent ${randomAm} on ${category.name}`;

      await knex("expenses").insert({
        userId: user.id,
        amount: randomAm,
        textMessage,
        categoryId: category.id,
        createdAt: new Date(randomTimestampYesterday),
      });
    }
  }
}
