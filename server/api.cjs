const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'taochow.onrender.com';
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// MongoDB connection
const ATLAS_URI = process.env.ATLAS_URI;
let recipesCollection;

async function connectDB() {
  try {
    const client = new MongoClient(ATLAS_URI);
    await client.connect();
    const db = client.db("taochow");
    recipesCollection = db.collection("recipes");
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Routes

// GET all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await recipesCollection.find({}).toArray();
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// GET a single recipe by ID
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await recipesCollection.findOne({
      $or: [
        { _id: new ObjectId(req.params.id) },
        { id: req.params.id }
      ]
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// CREATE a new recipe
app.post("/api/recipes", async (req, res) => {
  try {
    const { title, image, ingredients, instructions, chefNotes } = req.body;

    // Validate required fields
    if (!title || !Array.isArray(ingredients) || !Array.isArray(instructions)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRecipe = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title,
      image: image || null,
      ingredients,
      instructions,
      chefNotes: chefNotes || "",
      createdAt: new Date().toISOString(),
      iterations: []
    };

    const result = await recipesCollection.insertOne(newRecipe);
    res.status(201).json({ ...newRecipe, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

// UPDATE an existing recipe
app.put("/api/recipes/:id", async (req, res) => {
  try {
    const { title, image, ingredients, instructions, chefNotes } = req.body;

    // Validate required fields
    if (!title || !Array.isArray(ingredients) || !Array.isArray(instructions)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updateData = {
      title,
      image: image || null,
      ingredients,
      instructions,
      chefNotes: chefNotes || "",
      updatedAt: new Date().toISOString()
    };

    const result = await recipesCollection.findOneAndUpdate(
      {
        $or: [
          { _id: new ObjectId(req.params.id) },
          { id: req.params.id }
        ]
      },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.value);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE a recipe
app.delete("/api/recipes/:id", async (req, res) => {
  try {
    const result = await recipesCollection.deleteOne({
      $or: [
        { _id: new ObjectId(req.params.id) },
        { id: req.params.id }
      ]
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

// ADD an iteration to a recipe
app.post("/api/recipes/:id/iterations", async (req, res) => {
  try {
    const { chef, changesMade, outcome, image } = req.body;

    if (!chef || !changesMade || !outcome) {
      return res.status(400).json({ error: "Missing required iteration fields" });
    }

    const newIteration = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      date: new Date().toISOString().split("T")[0],
      chef,
      changesMade,
      outcome,
      image: image || null
    };

    const result = await recipesCollection.findOneAndUpdate(
      {
        $or: [
          { _id: new ObjectId(req.params.id) },
          { id: req.params.id }
        ]
      },
      { $push: { iterations: newIteration } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.value);
  } catch (error) {
    console.error("Error adding iteration:", error);
    res.status(500).json({ error: "Failed to add iteration" });
  }
});

// DELETE an iteration from a recipe
app.delete("/api/recipes/:id/iterations/:iterationId", async (req, res) => {
  try {
    const result = await recipesCollection.findOneAndUpdate(
      {
        $or: [
          { _id: new ObjectId(req.params.id) },
          { id: req.params.id }
        ]
      },
      { $pull: { iterations: { id: req.params.iterationId } } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(result.value);
  } catch (error) {
    console.error("Error deleting iteration:", error);
    res.status(500).json({ error: "Failed to delete iteration" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});
// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));

  // Return index.html for any unknown routes (client-side routing)
  app.get('*', (req, res) => {
    // If request is for API, skip
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}`);
    console.log(`API endpoints:`);
    console.log(`  GET    /api/recipes`);
    console.log(`  GET    /api/recipes/:id`);
    console.log(`  POST   /api/recipes`);
    console.log(`  PUT    /api/recipes/:id`);
    console.log(`  DELETE /api/recipes/:id`);
    console.log(`  POST   /api/recipes/:id/iterations`);
    console.log(`  DELETE /api/recipes/:id/iterations/:iterationId`);
  });
});
