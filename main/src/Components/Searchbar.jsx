import React, { useState, useEffect } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSelectProduct }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  const userUID = localStorage.getItem("userUID");

  useEffect(() => {
    if (!userUID || query.trim().length < 2) {
      setProducts([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(
        `http://127.0.0.1:5000/api/suggest?uid=${userUID}&q=${encodeURIComponent(query)}`
      )
        .then((res) => res.json())
        .then((data) => {
          // ✅ backend now returns full objects
          setProducts(data.products || []);
        })
        .catch(() => {
          setProducts([]);
        });
    }, 150);

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

      {products.length > 0 && (
        <div className="autocomplete-dropdown">
          {products.map((p) => (
            <button
              key={p.PID}                 // ✅ use real id, not index
              type="button"
              className="autocomplete-item"
              onMouseDown={() => {
  onSelectProduct?.(p);  // ✅ adds to cart via parent
  setQuery("");          // optional: clear box after adding
  setProducts([]);       // close dropdown
}}
            >
              {p.Name}
              <p>Price: ${((p.PriceCents || 0) / 100).toFixed(2)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
