import React, { useMemo, useState } from 'react';
import { useRecipes } from './RecipeContext';
import SearchBar from '../components/SearchBar';
import RecipeGrid from '../components/RecipeGrid';
import './Home.css';

function Home({ onEditRecipe }) {
  const { recipes, loading } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter((r) => r.title.toLowerCase().includes(q));
  }, [recipes, searchQuery]);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-wrap">
          <div className="hero-left">
            <img
              src="/welcome_taochow.png"
              alt="Welcome to Tao Chow"
              className="hero-welcome"
            />

            <p className="hero-blurb">
              a virtual and dynamic cookbook for the <strong>Tao-Imel</strong> family and friends
            </p>

            <div className="hero-divider" />
          </div>

          <aside className="hero-right" aria-label="Nainai mascot">
            <img
              src="/nainai_taochow.png"
              alt="Nainai"
              className="nainai"
            />
          </aside>
        </div>
      </section>

      {/* RECIPES */}
      <section className="recipes-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recipes</h2>
            <p className="section-description">
              Search by name, then open a recipe to view ingredients, instructions, and iterations.
            </p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search recipes…"
          />

          {loading ? (
            <div className="loading-state">
              <p>Loading recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No recipes yet</div>
              <p className="empty-state-text">
                Click <strong>Add Recipe</strong> in the header to start your collection.
              </p>
            </div>
          ) : (
            <RecipeGrid recipes={filteredRecipes} onEditRecipe={onEditRecipe} />
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
