export type ChatCompletion = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
} | null;

export const todoCategories = [
  "Fruits and vegetables",
  "Dairy and eggs",
  "Meat and poultry",
  "Fish and seafood",
  "Grains, pasta, and rice",
  "Breads and bakery",
  "Canned and jarred goods",
  "Frozen foods",
  "Snacks and sweets",
  "Condiments and sauces",
  "Spices and seasonings",
  "Beverages",
  "Breakfast items",
  "Deli and prepared foods",
  "Cooking oils and fats",
  "Baking supplies",
  "Health foods and supplements",
  "Baby and toddler products",
  "Pet food and supplies",
  "Household and cleaning products",
  "Personal care items",
  "Office supplies",
  "Other"
] as const;

export type TodoCategory = typeof todoCategories[number]

export type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
  category: TodoCategory;
};
