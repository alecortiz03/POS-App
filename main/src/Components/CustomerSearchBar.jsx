import React, { useState, useEffect } from "react";
import "./CustomerSearchBar.css";

export default function CustomerSearchBar() {

  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState([]);

  const userUID = localStorage.getItem("userUID");

  useEffect(() => {

    if (!userUID || query.trim().length < 2) {
      setCustomers([]);
      return;
    }

    const timeout = setTimeout(() => {

      fetch(
        `http://127.0.0.1:5000/api/customers/suggest?uid=${userUID}&q=${encodeURIComponent(query)}`
      )
        .then(res => res.json())
        .then(data => {
          setCustomers(data.customers || []);
        })
        .catch(() => {
          setCustomers([]);
        });

    }, 150);

    return () => clearTimeout(timeout);

  }, [query, userUID]);

  const formatName = (c) => {
    const first = c.first_name || "";
    const last = c.last_name || "";
    const fullName = `${first} ${last}`.trim();
    const username =
      c.display_name && c.display_name.trim() !== ""
        ? c.display_name
        : null;

    if (username) return `${fullName || "Unnamed Customer"} (${username})`;
    return fullName || "Unnamed Customer";
  };

  const formatSecondary = (c) => {
    const parts = [];
    if (c.email) parts.push(c.email);
    if (c.phone) parts.push(c.phone);

    const location = [c.city, c.province_state].filter(Boolean).join(", ");
    if (location) parts.push(location);

    return parts.join(" • ");
  };

  return (
    <div className="customer-search-wrapper">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Customers (name, username, email, phone...)"
        className="CustomerSearchBar"
      />

      {/* Dropdown suggestions */}
{customers.length > 0 && (
  <div className="customer-autocomplete-dropdown">
    {customers.map((c) => (
      <button
        key={c.customer_id}
        type="button"
        className="customer-autocomplete-button"
      >
        <div className="customer-suggest-title">
          {formatName(c)}
        </div>

        <div className="customer-suggest-subtitle">
          {formatSecondary(c)}
        </div>
      </button>
    ))}
  </div>
)}


      

    </div>
  );
}
