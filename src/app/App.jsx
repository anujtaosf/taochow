import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecipeProvider, useRecipes } from './RecipeContext';
import Header from '../components/Header';
import RecipeFormModal from '../components/RecipeFormModal';
import Home from './Home';
import RecipeView from '../components/RecipeView';
import '../styles/globals.css';

function AppContent() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const { createRecipe, updateRecipe } = useRecipes();

  const handleAddRecipe = async (recipeData) => {
    try {
      await createRecipe(recipeData);
      setShowAddModal(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Error adding recipe. Please try again.');
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowAddModal(true);
  };

  const handleUpdateRecipe = async (recipeData) => {
    try {
      const recipeId = editingRecipe.id || editingRecipe._id;
      await updateRecipe(recipeId, recipeData);
      setShowAddModal(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error updating recipe. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingRecipe(null);
  };

  return (
    <div className="app">
      <Header onAddRecipe={() => {
        setEditingRecipe(null);
        setShowAddModal(true);
      }} />

      <Routes>
        <Route path="/" element={<Home onEditRecipe={handleEditRecipe} />} />
        <Route path="/recipe/:id" element={<RecipeView onEditRecipe={handleEditRecipe} />} />
      </Routes>

      <RecipeFormModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
        editRecipe={editingRecipe}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RecipeProvider>
        <AppContent />
      </RecipeProvider>
    </BrowserRouter>
  );
}

export default App;
