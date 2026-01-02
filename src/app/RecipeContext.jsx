import React, { createContext, useContext, useState, useEffect } from 'react';
import { recipeStore } from '../data/store';

const API_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useAPI, setUseAPI] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      // Try to load from API first
      try {
        const response = await fetch(`${API_URL}/recipes`);
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
          setUseAPI(true);
          return;
        }
      } catch (apiError) {
        console.log('API not available, falling back to localStorage');
      }

      // Fallback to localStorage
      const data = await recipeStore.list();
      setRecipes(data);
      setUseAPI(false);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      if (useAPI) {
        const response = await fetch(`${API_URL}/recipes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
          throw new Error('Failed to create recipe on server');
        }

        const newRecipe = await response.json();
        setRecipes(prev => [...prev, newRecipe]);
      } else {
        await recipeStore.create(recipeData);
        await loadRecipes();
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  };

  const updateRecipe = async (recipeId, recipeData) => {
    try {
      if (useAPI) {
        const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
          throw new Error('Failed to update recipe on server');
        }

        const updatedRecipe = await response.json();
        setRecipes(prev =>
          prev.map(r => (r.id === recipeId || r._id === recipeId) ? updatedRecipe : r)
        );
      } else {
        await recipeStore.update(recipeId, recipeData);
        await loadRecipes();
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      if (useAPI) {
        const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete recipe from server');
        }

        setRecipes(prev => prev.filter(r => r.id !== recipeId && r._id !== recipeId));
      } else {
        await recipeStore.delete(recipeId);
        await loadRecipes();
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  };

  const addIteration = async (recipeId, iterationData) => {
    try {
      if (useAPI) {
        const response = await fetch(`${API_URL}/recipes/${recipeId}/iterations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(iterationData)
        });

        if (!response.ok) {
          throw new Error('Failed to add iteration on server');
        }

        const updatedRecipe = await response.json();
        setRecipes(prev =>
          prev.map(r => (r.id === recipeId || r._id === recipeId) ? updatedRecipe : r)
        );
      } else {
        await recipeStore.addIteration(recipeId, iterationData);
        await loadRecipes();
      }
    } catch (error) {
      console.error('Error adding iteration:', error);
      throw error;
    }
  };

  const deleteIteration = async (recipeId, iterationId) => {
    try {
      if (useAPI) {
        const response = await fetch(`${API_URL}/recipes/${recipeId}/iterations/${iterationId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete iteration from server');
        }

        const updatedRecipe = await response.json();
        setRecipes(prev =>
          prev.map(r => (r.id === recipeId || r._id === recipeId) ? updatedRecipe : r)
        );
      } else {
        await recipeStore.deleteIteration(recipeId, iterationId);
        await loadRecipes();
      }
    } catch (error) {
      console.error('Error deleting iteration:', error);
      throw error;
    }
  };

  const value = {
    recipes,
    loading,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    addIteration,
    deleteIteration,
    reloadRecipes: loadRecipes
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
