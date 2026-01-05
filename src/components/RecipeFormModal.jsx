import React, { useState, useEffect } from 'react';
import MultiImagePicker from './MultiImagePicker';
import './RecipeFormModal.css';

function RecipeFormModal({ isOpen, onClose, onSave, editRecipe = null }) {
  const isEditing = !!editRecipe;

  const [formData, setFormData] = useState({
    title: '',
    images: [],
    ingredients: '',
    instructions: '',
    chefNotes: ''
  });

  // Load existing recipe data when editing or draft when creating
  useEffect(() => {
    if (isOpen) {
      if (editRecipe) {
        // Pre-populate form with existing recipe data
        // Support both old 'image' field and new 'images' array
        let recipeImages = [];
        if (editRecipe.images && Array.isArray(editRecipe.images)) {
          recipeImages = editRecipe.images;
        } else if (editRecipe.image) {
          recipeImages = [editRecipe.image];
        }

        setFormData({
          title: editRecipe.title,
          images: recipeImages,
          ingredients: editRecipe.ingredients.join('\n'),
          instructions: (editRecipe.instructions || []).join('\n'),
          chefNotes: editRecipe.chefNotes || ''
        });
      } else {
        // Load draft from localStorage when creating new recipe
        const draft = localStorage.getItem('draftRecipe');
        if (draft) {
          try {
            const parsed = JSON.parse(draft);
            setFormData({
              ...parsed,
              images: parsed.images || [],
              instructions: Array.isArray(parsed.instructions) ? parsed.instructions.join('\n') : parsed.instructions || ''
            });
          } catch (e) {
            console.error('Error loading draft:', e);
          }
        }
      }
    }
  }, [isOpen, editRecipe]);

  // Save draft to localStorage on changes (only when creating, not editing)
  useEffect(() => {
    if (isOpen && !isEditing && formData.title) {
      localStorage.setItem('draftRecipe', JSON.stringify(formData));
    }
  }, [formData, isOpen, isEditing]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      alert('Please enter a recipe title');
      return;
    }

    // Parse ingredients
    const ingredients = formData.ingredients
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Parse instructions
    const instructions = formData.instructions
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Confirm if ingredients or instructions are empty
    if (ingredients.length === 0 || instructions.length === 0) {
      const proceed = window.confirm(
        'Ingredients or instructions are empty. Save anyway?'
      );
      if (!proceed) return;
    }

    const recipeData = {
      title: formData.title.trim(),
      images: formData.images,
      ingredients: ingredients.length > 0 ? ingredients : [],
      instructions: instructions.length > 0 ? instructions : [],
      chefNotes: formData.chefNotes.trim()
    };

    // Pass the editRecipe ID if editing
    if (isEditing) {
      recipeData.id = editRecipe.id || editRecipe._id;
    }

    await onSave(recipeData);

    // Clear draft and form (only clear draft if creating new recipe)
    if (!isEditing) {
      localStorage.removeItem('draftRecipe');
    }
    setFormData({
      title: '',
      images: [],
      ingredients: '',
      instructions: '',
      chefNotes: ''
    });

    onClose();
  };

  const handleCancel = () => {
    if (formData.title || formData.ingredients || formData.instructions) {
      const proceed = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!proceed) return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title" className="label">
                Recipe Title <span className="required">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Grandma's Fried Rice"
                className="input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="label">Recipe Photos (optional)</label>
              <MultiImagePicker
                value={formData.images}
                onChange={(value) => handleChange('images', value)}
                label="Add Photos"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ingredients" className="label">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => handleChange('ingredients', e.target.value)}
                placeholder="Enter each ingredient on a new line&#10;e.g.,&#10;1/2 cup rice&#10;2 eggs&#10;1 tbsp soy sauce"
                className="textarea"
                rows={8}
              />
              <p className="field-hint">One ingredient per line</p>
            </div>

            <div className="form-group">
              <label htmlFor="instructions" className="label">
                Instructions <span className="required">*</span>
              </label>
              <textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                placeholder="Enter each step on a new line&#10;e.g.,&#10;Heat oil in a large pan over medium-high heat&#10;Add rice and stir-fry for 2-3 minutes&#10;Push rice to the side and scramble the eggs"
                className="textarea"
                rows={8}
              />
              <p className="field-hint">One step per line</p>

              {formData.instructions && (
                <div className="instructions-preview">
                  <p className="instructions-preview-title">Preview:</p>
                  <ol className="instructions-preview-list">
                    {formData.instructions
                      .split('\n')
                      .filter(line => line.trim())
                      .map((step, index) => (
                        <li key={index}>{step.trim()}</li>
                      ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="chefNotes" className="label">
                Chef's Notes (optional)
              </label>
              <textarea
                id="chefNotes"
                value={formData.chefNotes}
                onChange={(e) => handleChange('chefNotes', e.target.value)}
                placeholder="Tips, tricks, or secrets for making this recipe perfect..."
                className="textarea"
                rows={4}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Recipe' : 'Save Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeFormModal;
