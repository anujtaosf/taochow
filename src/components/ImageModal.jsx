import React from 'react';
import './ImageModal.css';

function ImageModal({ image, alt, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="image-modal-backdrop" onClick={onClose}>
      <div className="image-modal-container">
        <button
          className="image-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={image}
          alt={alt}
          className="image-modal-image"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

export default ImageModal;
