import React from 'react';
import './IterationTable.css';

function IterationTable({ iterations, onDelete }) {
  if (iterations.length === 0) {
    return (
      <div className="iteration-empty">
        <p>No iterations yet. Try this recipe and add your changes!</p>
      </div>
    );
  }

  const handleDelete = (iteration) => {
    const confirm = window.confirm(
      `Are you sure you want to delete the iteration by ${iteration.chef} from ${new Date(iteration.date).toLocaleDateString()}?`
    );
    if (confirm && onDelete) {
      onDelete(iteration.id);
    }
  };

  return (
    <div className="iteration-table-container">
      <table className="iteration-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Chef</th>
            <th>Changes Made</th>
            <th>Outcome</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {iterations.map((iteration) => (
            <tr key={iteration.id}>
              <td data-label="Date">{new Date(iteration.date).toLocaleDateString()}</td>
              <td data-label="Chef">{iteration.chef}</td>
              <td data-label="Changes Made">{iteration.changesMade}</td>
              <td data-label="Outcome">{iteration.outcome}</td>
              <td data-label="Photo">
                {iteration.image ? (
                  <button
                    className="iteration-image-preview"
                    onClick={() => window.open(iteration.image, '_blank')}
                  >
                    <img src={iteration.image} alt="Iteration" />
                  </button>
                ) : (
                  <span className="iteration-no-image">-</span>
                )}
              </td>
              <td data-label="Actions">
                <button
                  onClick={() => handleDelete(iteration)}
                  className="btn-icon btn-icon-danger"
                  aria-label="Delete iteration"
                  title="Delete iteration"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IterationTable;
