import React, { useState } from 'react';
import ImagePicker from './ImagePicker';

function IterationFormModal({ isOpen, onClose, onSave, recipeName }) {
  const [formData, setFormData] = useState({
    chef: '',
    changesMade: '',
    outcome: '',
    image: null
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.chef.trim()) {
      alert('Please enter the chef name');
      return;
    }
    if (!formData.changesMade.trim()) {
      alert('Please describe what changes you made');
      return;
    }
    if (!formData.outcome.trim()) {
      alert('Please describe the outcome');
      return;
    }

    const iterationData = {
      chef: formData.chef.trim(),
      changesMade: formData.changesMade.trim(),
      outcome: formData.outcome.trim(),
      image: formData.image
    };

    await onSave(iterationData);

    // Reset form
    setFormData({
      chef: '',
      changesMade: '',
      outcome: '',
      image: null
    });

    onClose();
  };

  const handleCancel = () => {
    if (formData.chef || formData.changesMade || formData.outcome) {
      const proceed = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!proceed) return;
    }
    setFormData({
      chef: '',
      changesMade: '',
      outcome: '',
      image: null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Iteration</h2>
          <p className="modal-subtitle">for {recipeName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="chef" className="label">
                Chef Name <span className="required">*</span>
              </label>
              <input
                id="chef"
                type="text"
                value={formData.chef}
                onChange={(e) => handleChange('chef', e.target.value)}
                placeholder="e.g., Karen Tao"
                className="input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="changesMade" className="label">
                Changes Made <span className="required">*</span>
              </label>
              <textarea
                id="changesMade"
                value={formData.changesMade}
                onChange={(e) => handleChange('changesMade', e.target.value)}
                placeholder="What did you change in this recipe? (e.g., Added more garlic, used sesame oil instead of vegetable oil)"
                className="textarea"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="outcome" className="label">
                Outcome <span className="required">*</span>
              </label>
              <textarea
                id="outcome"
                value={formData.outcome}
                onChange={(e) => handleChange('outcome', e.target.value)}
                placeholder="How did it turn out? (e.g., More flavorful, Too salty, Perfect!)"
                className="textarea"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="label">Photo (optional)</label>
              <ImagePicker
                value={formData.image}
                onChange={(value) => handleChange('image', value)}
                label="Add Photo of Your Version"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Iteration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IterationFormModal;
