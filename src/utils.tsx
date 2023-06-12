export async function getItemCategory(item: string) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }

  if (!item) {
    throw new Error("Missing item");
  }

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          'You are to act as categorisation system. You will be given an item and you must categorise it into one of the following categories: "Fruits and vegetables", "Dairy and eggs", "Meat and poultry", "Fish and seafood", "Grains, pasta, and rice", "Breads and bakery", "Canned and jarred goods", "Frozen foods", "Snacks and sweets", "Condiments and sauces", "Spices and seasonings", "Beverages", "Breakfast items", "Deli and prepared foods", "Cooking oils and fats", "Baking supplies", "Health foods and supplements", "Baby and toddler products", "Pet food and supplies", "Household and cleaning products", "Personal care items", "Office supplies", "Other". Only ever use the categories listed above, in the format listed above. If you are unsure, respond with simply: "Other".',
      },
      { role: "user", content: item },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = res.body;

  return new Response(data, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
