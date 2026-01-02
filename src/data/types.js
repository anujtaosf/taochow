/**
 * @typedef {Object} Iteration
 * @property {string} id - Unique identifier
 * @property {string} date - Date in ISO format
 * @property {string} chef - Name of the chef who made the iteration
 * @property {string} changesMade - Description of changes
 * @property {string} outcome - Result of the changes
 * @property {string} [image] - Optional image (base64 DataURL)
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id - Unique identifier (uuid)
 * @property {string} title - Recipe title
 * @property {string} [image] - Optional image (base64 DataURL)
 * @property {string[]} ingredients - List of ingredients
 * @property {string[]} instructions - Step-by-step instructions
 * @property {string} chefNotes - Chef's tips and notes
 * @property {string} createdAt - Creation date in ISO format
 * @property {Iteration[]} iterations - List of recipe iterations
 */

/**
 * @typedef {Object} RecipeCreateInput
 * @property {string} title
 * @property {string} [image]
 * @property {string[]} ingredients
 * @property {string[]} instructions
 * @property {string} chefNotes
 */

/**
 * @typedef {Object} IterationCreateInput
 * @property {string} chef
 * @property {string} changesMade
 * @property {string} outcome
 * @property {string} [image]
 */

export {};
