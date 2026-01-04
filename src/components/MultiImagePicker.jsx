import React, { useRef } from 'react';
import './MultiImagePicker.css';

function MultiImagePicker({ value = [], onChange, label = 'Add Photos' }) {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Process each file
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Images should be less than 5MB`);
          reject();
          return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises.filter(p => p))
      .then((base64Strings) => {
        const newImages = [...value, ...base64Strings];
        onChange(newImages);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      })
      .catch((error) => {
        console.error('Error loading images:', error);
      });
  };

  const handleRemove = (index) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="multi-image-picker">
      <div className="multi-image-picker-grid">
        {value.map((image, index) => (
          <div key={index} className="multi-image-picker-item">
            <img src={image} alt={`Upload ${index + 1}`} className="multi-image-picker-image" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="multi-image-picker-remove"
              aria-label="Remove image"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {index === 0 && (
              <span className="multi-image-picker-badge">Thumbnail</span>
            )}
          </div>
        ))}

        <div className="multi-image-picker-add">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="multi-image-picker-input"
            id="multi-image-picker-input"
          />
          <label htmlFor="multi-image-picker-input" className="multi-image-picker-label">
            <svg
              className="multi-image-picker-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="multi-image-picker-text">{label}</span>
          </label>
        </div>
      </div>
      {value.length > 0 && (
        <p className="multi-image-picker-hint">
          The first image will be used as the thumbnail
        </p>
      )}
    </div>
  );
}

export default MultiImagePicker;
