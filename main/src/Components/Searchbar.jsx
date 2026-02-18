import React, { useState, useEffect } from "react";
import "./SearchBar.css"; // ⭐ import css

export default function SearchBar() {

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // get UID from localStorage
  const userUID = localStorage.getItem("userUID");

  useEffect(() => {

    if (!userUID || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(() => {

      fetch(`http://127.0.0.1:5000/api/suggest?uid=${userUID}&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.suggestions || []);
        })
        .catch(() => {
          setSuggestions([]);
        });

    }, 150); // debounce

    return () => clearTimeout(timeout);

  }, [query, userUID]);

  return (
    <div className="search-wrapper">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Products"
        className="SearchBar"
      />

      {suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="autocomplete-item"
              onMouseDown={() => setQuery(s)} // prevents blur before click
            >
              {s}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
