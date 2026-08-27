import React from "react";

// Controlled input: the parent (App) owns the search value.
// This component just displays it and reports changes upward.
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name, email, or course..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search students"
      />
      {value && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
