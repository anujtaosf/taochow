const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

// Sample recipes data structure - same as in the React app
const recipesToStore = [
  {
    id: "recipe-001",
    title: "Kung Pao Chicken",
    image: null,
    ingredients: [
      "1.5 lbs chicken breast, cubed",
      "1 cup roasted peanuts",
      "3 tbsp soy sauce",
      "2 tbsp rice vinegar",
      "2 tbsp sugar",
      "4 cloves garlic, minced",
      "1 tbsp ginger, minced",
      "3-4 dried red chili peppers",
      "2 green onions, chopped",
      "1 tbsp sesame oil"
    ],
    instructions: [
      "Heat oil in a wok or large pan over high heat",
      "Add garlic and ginger, stir-fry for 30 seconds",
      "Add chicken cubes and stir-fry until cooked through (5-7 minutes)",
      "Add soy sauce, vinegar, and sugar, mix well",
      "Add peanuts and dried chili peppers, toss to combine",
      "Finish with sesame oil and green onions",
      "Serve hot over rice"
    ],
    chefNotes:
      "The key is high heat and quick cooking to keep the chicken tender. Don't overcook. Roasted peanuts work best for texture.",
    createdAt: new Date().toISOString(),
    iterations: []
  },
  {
    id: "recipe-002",
    title: "Mapo Tofu",
    image: null,
    ingredients: [
      "1 block firm tofu, cubed",
      "1/2 lb ground pork",
      "3 tbsp doubanjiang (spicy bean paste)",
      "2 tbsp soy sauce",
      "1 tbsp rice vinegar",
      "4 cloves garlic, minced",
      "1 tbsp ginger, minced",
      "2 green onions, chopped",
      "1 tsp Sichuan peppercorns, ground",
      "1/2 cup chicken stock",
      "1 tbsp cornstarch mixed with 2 tbsp water",
      "Sesame oil for finishing"
    ],
    instructions: [
      "Heat oil in a pan, add garlic and ginger, stir-fry briefly",
      "Add ground pork and cook until no longer pink",
      "Stir in doubanjiang and cook for 1 minute until fragrant",
      "Add soy sauce, vinegar, and chicken stock",
      "Gently add tofu cubes and simmer for 5 minutes",
      "Thicken with cornstarch slurry while stirring gently",
      "Sprinkle with Sichuan peppercorns and sesame oil",
      "Top with green onions and serve over rice"
    ],
    chefNotes:
      "Be gentle with the tofu to keep the cubes intact. The numbing sensation from Sichuan peppercorns is essential for authentic flavor.",
    createdAt: new Date().toISOString(),
    iterations: []
  }
];

async function storeRecipes() {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db("taochow");
    const recipesCollection = database.collection("recipes");

    // Clear existing recipes (optional - comment out if you want to keep existing data)
    // const deleteResult = await recipesCollection.deleteMany({});
    // console.log(`Deleted ${deleteResult.deletedCount} existing recipes`);

    // Insert new recipes
    const insertResult = await recipesCollection.insertMany(recipesToStore);
    console.log(`Successfully inserted ${insertResult.insertedIds.length} recipes`);
    console.log("Inserted recipe IDs:", insertResult.insertedIds);

    // Verify the insert by listing all recipes
    const allRecipes = await recipesCollection.find({}).toArray();
    console.log(`\nTotal recipes in database: ${allRecipes.length}`);
    console.log("\nRecipes stored:");
    allRecipes.forEach((recipe) => {
      console.log(`  - ${recipe.title} (ID: ${recipe.id})`);
    });
  } catch (error) {
    console.error("Error storing recipes:", error);
  } finally {
    await client.close();
    console.log("\nConnection closed");
  }
}

storeRecipes();
