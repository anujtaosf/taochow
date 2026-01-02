import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipeGrid.css';

function RecipeGrid({ recipes, onEditRecipe }) {
  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No recipes found</div>
        <p className="empty-state-text">
          Try adjusting your search or add a new recipe to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id || recipe._id} recipe={recipe} onEditRecipe={onEditRecipe} />
      ))}
    </div>
  );
}

export default RecipeGrid;
