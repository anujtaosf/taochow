import { recipesSeed } from './recipesSeed';

const STORAGE_KEY = 'taochow_recipes';

/**
 * Generate a simple unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * LocalRecipeStore - manages recipes in localStorage
 * This abstraction makes it easy to swap to MongoDB later
 */
export class LocalRecipeStore {
  /**
   * Get all recipes
   * @returns {Promise<import('./types').Recipe[]>}
   */
  async list() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored recipes:', e);
        return recipesSeed;
      }
    }
    // First load: initialize from seed
    await this._save(recipesSeed);
    return recipesSeed;
  }

  /**
   * Get a single recipe by ID
   * @param {string} id
   * @returns {Promise<import('./types').Recipe | null>}
   */
  async get(id) {
    const recipes = await this.list();
    return recipes.find(r => r.id === id) || null;
  }

  /**
   * Create a new recipe
   * @param {import('./types').RecipeCreateInput} input
   * @returns {Promise<import('./types').Recipe>}
   */
  async create(input) {
    const recipes = await this.list();

    const newRecipe = {
      id: generateId(),
      title: input.title,
      image: input.image || null,
      ingredients: input.ingredients,
      instructions: input.instructions,
      chefNotes: input.chefNotes,
      createdAt: new Date().toISOString(),
      iterations: []
    };

    recipes.push(newRecipe);
    await this._save(recipes);
    return newRecipe;
  }

  /**
   * Update an existing recipe
   * @param {string} id
   * @param {Partial<import('./types').RecipeCreateInput>} updates
   * @returns {Promise<import('./types').Recipe>}
   */
  async update(id, updates) {
    const recipes = await this.list();
    const index = recipes.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error(`Recipe with id ${id} not found`);
    }

    recipes[index] = {
      ...recipes[index],
      ...updates
    };

    await this._save(recipes);
    return recipes[index];
  }

  /**
   * Add an iteration to a recipe
   * @param {string} recipeId
   * @param {import('./types').IterationCreateInput} input
   * @returns {Promise<import('./types').Recipe>}
   */
  async addIteration(recipeId, input) {
    const recipes = await this.list();
    const recipe = recipes.find(r => r.id === recipeId);

    if (!recipe) {
      throw new Error(`Recipe with id ${recipeId} not found`);
    }

    const newIteration = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      chef: input.chef,
      changesMade: input.changesMade,
      outcome: input.outcome,
      image: input.image || null
    };

    recipe.iterations.push(newIteration);
    await this._save(recipes);
    return recipe;
  }

  /**
   * Delete an iteration from a recipe
   * @param {string} recipeId
   * @param {string} iterationId
   * @returns {Promise<import('./types').Recipe>}
   */
  async deleteIteration(recipeId, iterationId) {
    const recipes = await this.list();
    const recipe = recipes.find(r => r.id === recipeId);

    if (!recipe) {
      throw new Error(`Recipe with id ${recipeId} not found`);
    }

    recipe.iterations = recipe.iterations.filter(iter => iter.id !== iterationId);
    await this._save(recipes);
    return recipe;
  }

  /**
   * Delete a recipe
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const recipes = await this.list();
    const filtered = recipes.filter(r => r.id !== id);
    await this._save(filtered);
  }

  /**
   * Private method to save recipes to localStorage
   * @private
   * @param {import('./types').Recipe[]} recipes
   */
  async _save(recipes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }
}

// Export a singleton instance
export const recipeStore = new LocalRecipeStore();
