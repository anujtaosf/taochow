import React, { useRef, useState } from 'react';
import './ImagePicker.css';

function ImagePicker({ value, onChange, label = 'Add Photo' }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="image-picker">
      {preview ? (
        <div className="image-picker-preview">
          <img src={preview} alt="Preview" className="image-picker-image" />
          <button
            type="button"
            onClick={handleRemove}
            className="btn btn-secondary image-picker-remove"
          >
            Remove Photo
          </button>
        </div>
      ) : (
        <div className="image-picker-empty">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="image-picker-input"
            id="image-picker-input"
          />
          <label htmlFor="image-picker-input" className="image-picker-label">
            <svg
              className="image-picker-icon"
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
            <span className="image-picker-text">{label}</span>
          </label>
        </div>
      )}
    </div>
  );
}

export default ImagePicker;
