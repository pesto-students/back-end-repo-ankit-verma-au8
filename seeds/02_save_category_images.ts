import * as Knex from "knex";

enum categoryImages {
  "Food/Drinks" = "food",
  "Clothing" = "clothing",
  "Technology" = "technology",
  "Transportation" = "transportation",
  "Gifts" = "gifts",
  "Entertainment" = "entertainment",
  "Books/Magazine" = "books",
  "Education" = "education",
  "Sports" = "sports",
  "Pets" = "pets",
  "Travel" = "travel",
}

export async function seed(knex: Knex): Promise<void> {
  const categories = await knex("expenseCategories").select("*");
  for (let value of categories) {
    await knex("expenseCategories").where({ id: value.id }).update({
      imageId: categoryImages[value.name],
    });
  }
}
