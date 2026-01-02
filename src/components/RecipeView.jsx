import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../app/RecipeContext';
import { recipeStore } from '../data/store';
import IterationTable from './IterationTable';
import IterationFormModal from './IterationFormModal';
import RecipeFormModal from './RecipeFormModal';
import './RecipeView.css';

function RecipeView({ onEditRecipe }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRecipe, addIteration, deleteIteration } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIterationModal, setShowIterationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadRecipe = useCallback(async () => {
    setLoading(true);
    try {
      // Try localStorage first for fallback
      const data = await recipeStore.get(id);
      if (data) {
        setRecipe(data);
      } else {
        alert('Recipe not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      alert('Error loading recipe');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  const handleAddIteration = async (iterationData) => {
    try {
      await addIteration(id, iterationData);
      await loadRecipe();
      setShowIterationModal(false);
    } catch (error) {
      console.error('Error adding iteration:', error);
      alert('Error adding iteration');
    }
  };

  const handleDeleteIteration = async (iterationId) => {
    try {
      await deleteIteration(id, iterationId);
      await loadRecipe();
    } catch (error) {
      console.error('Error deleting iteration:', error);
      alert('Error deleting iteration');
    }
  };

  const handleEditRecipe = async (recipeData) => {
    try {
      await updateRecipe(id, recipeData);
      await loadRecipe();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error updating recipe');
    }
  };

  if (loading) {
    return (
      <div className="recipe-view-loading">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="recipe-view">
      <div className="container">
        <button onClick={() => navigate('/')} className="recipe-view-back">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to recipes
        </button>

        <div className="recipe-view-header">
          <div className="recipe-view-title-row">
            <h1 className="recipe-view-title">{recipe.title}</h1>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn btn-secondary"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Recipe
            </button>
          </div>
          {recipe.image && (
            <div className="recipe-view-image-container">
              <img src={recipe.image} alt={recipe.title} className="recipe-view-image" />
            </div>
          )}
        </div>

        <div className="recipe-view-content">
          <div className="recipe-view-main">
            <div className="recipe-view-section">
              <h2 className="recipe-view-section-title">Ingredients</h2>
              <ul className="recipe-view-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="recipe-view-section">
              <h2 className="recipe-view-section-title">Instructions</h2>
              <ol className="recipe-view-list recipe-view-list-ordered">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="recipe-view-sidebar">
            <div className="recipe-view-section recipe-view-tips">
              <h2 className="recipe-view-section-title">
                <span className="recipe-view-tips-icon">💡</span>
                Chef's Tips
              </h2>
              {recipe.chefNotes ? (
                <p className="recipe-view-tips-text">{recipe.chefNotes}</p>
              ) : (
                <p className="recipe-view-tips-text recipe-view-tips-empty">
                  No tips yet for this recipe.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="recipe-view-iterations">
          <div className="recipe-view-iterations-header">
            <h2 className="recipe-view-section-title">Iteration Log</h2>
            <button
              onClick={() => setShowIterationModal(true)}
              className="btn btn-primary"
            >
              Add New Version
            </button>
          </div>
          <p className="recipe-view-iterations-subtitle">
            Track how this recipe has evolved over time
          </p>
          <IterationTable
            iterations={recipe.iterations}
            onDelete={handleDeleteIteration}
          />
        </div>
      </div>

      <IterationFormModal
        isOpen={showIterationModal}
        onClose={() => setShowIterationModal(false)}
        onSave={handleAddIteration}
        recipeName={recipe.title}
      />

      <RecipeFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditRecipe}
        editRecipe={recipe}
      />
    </div>
  );
}

export default RecipeView;
