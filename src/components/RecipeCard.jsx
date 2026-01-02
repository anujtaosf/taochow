import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

function RecipeCard({ recipe, onEditRecipe }) {
  const handleEdit = (e) => {
    e.preventDefault();
    if (onEditRecipe) {
      onEditRecipe(recipe);
    }
  };

  return (
    <Link to={`/recipe/${recipe.id || recipe._id}`} className="recipe-card">
      <div className="recipe-card-image-container">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />
        ) : (
          <div className="recipe-card-placeholder">
            <svg
              className="recipe-card-placeholder-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {onEditRecipe && (
          <button
            onClick={handleEdit}
            className="recipe-card-edit-btn"
            title="Edit recipe"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <div className="recipe-card-meta">
          <span className="recipe-card-meta-item">
            {recipe.ingredients.length} ingredients
          </span>
          <span className="recipe-card-meta-separator">•</span>
          <span className="recipe-card-meta-item">
            {(recipe.iterations || []).length} {(recipe.iterations || []).length === 1 ? 'iteration' : 'iterations'}
          </span>
        </div>
        <div className="recipe-card-footer">
          <span className="recipe-card-link-text">
            See recipe
            <svg className="recipe-card-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
