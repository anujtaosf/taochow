import React, { useState, useEffect } from 'react';
import ImagePicker from './ImagePicker';
import './RecipeFormModal.css';

function RecipeFormModal({ isOpen, onClose, onSave, editRecipe = null }) {
  const isEditing = !!editRecipe;

  const [formData, setFormData] = useState({
    title: '',
    image: null,
    ingredients: '',
    instructions: [],
    chefNotes: ''
  });

  const [currentStepInput, setCurrentStepInput] = useState('');

  // Load existing recipe data when editing or draft when creating
  useEffect(() => {
    if (isOpen) {
      if (editRecipe) {
        // Pre-populate form with existing recipe data
        setFormData({
          title: editRecipe.title,
          image: editRecipe.image || null,
          ingredients: editRecipe.ingredients.join('\n'),
          instructions: editRecipe.instructions || [],
          chefNotes: editRecipe.chefNotes || ''
        });
        setCurrentStepInput('');
      } else {
        // Load draft from localStorage when creating new recipe
        const draft = localStorage.getItem('draftRecipe');
        if (draft) {
          try {
            const parsed = JSON.parse(draft);
            setFormData({
              ...parsed,
              instructions: Array.isArray(parsed.instructions) ? parsed.instructions : parsed.instructions ? parsed.instructions.split('\n') : []
            });
          } catch (e) {
            console.error('Error loading draft:', e);
          }
        }
        setCurrentStepInput('');
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

  const handleAddStep = () => {
    const trimmedStep = currentStepInput.trim();
    if (trimmedStep) {
      setFormData(prev => ({
        ...prev,
        instructions: [...prev.instructions, trimmedStep]
      }));
      setCurrentStepInput('');
    }
  };

  const handleRemoveStep = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleStepInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStep();
    }
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

    const instructions = formData.instructions.filter(step => step.length > 0);

    // Confirm if ingredients or instructions are empty
    if (ingredients.length === 0 || instructions.length === 0) {
      const proceed = window.confirm(
        'Ingredients or instructions are empty. Save anyway?'
      );
      if (!proceed) return;
    }

    const recipeData = {
      title: formData.title.trim(),
      image: formData.image,
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
      image: null,
      ingredients: '',
      instructions: [],
      chefNotes: ''
    });
    setCurrentStepInput('');

    onClose();
  };

  const handleCancel = () => {
    if (formData.title || formData.ingredients || formData.instructions.length > 0) {
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
              <label className="label">Recipe Photo (optional)</label>
              <ImagePicker
                value={formData.image}
                onChange={(value) => handleChange('image', value)}
                label="Add Recipe Photo"
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
              <label className="label">
                Instructions <span className="required">*</span>
              </label>
              <div className="steps-container">
                {formData.instructions.length > 0 && (
                  <div className="steps-list">
                    {formData.instructions.map((step, index) => (
                      <div key={index} className="step-item">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-text">{step}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
                          className="btn-remove-step"
                          title="Remove step"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="step-input-group">
                  <span className="step-number">{formData.instructions.length + 1}</span>
                  <input
                    type="text"
                    value={currentStepInput}
                    onChange={(e) => setCurrentStepInput(e.target.value)}
                    onKeyDown={handleStepInputKeyDown}
                    placeholder="Enter a step and press Enter..."
                    className="step-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="btn-add-step"
                  >
                    Add
                  </button>
                </div>
              </div>
              <p className="field-hint">Press Enter or click Add to add each step</p>
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
