import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

function Header({ onAddRecipe }) {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="header-logo-link">
          <Logo size="medium" />
        </Link>

        <div className="header-message">
        </div>

        <button onClick={onAddRecipe} className="btn btn-primary header-add-btn">
          <span className="header-add-icon">+</span>
          Add Recipe
        </button>
      </div>
    </header>
  );
}

export default Header;
