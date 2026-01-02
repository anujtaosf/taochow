import React from 'react';
import './SearchBar.css';

function SearchBar({ value, onChange, placeholder = 'Search recipes...' }) {
  return (
    <div className="search-bar">
      <svg className="search-bar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-bar-input"
        aria-label="Search recipes"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="search-bar-clear"
          aria-label="Clear search"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
