import React from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/SearchHeader.css";

const cities = [
  "Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli",
  "Vellore","Erode","Thoothukudi","Thanjavur","Dindigul","Nagercoil",
  "Cuddalore","Kanchipuram","Karur","Namakkal","Krishnagiri",
  "Tiruvannamalai","Villupuram","Sivaganga"
];

const SearchHeader = ({ filters, onFilterChange, onSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="search-header" role="search" aria-label="Property search">
      <div className="search-box" tabIndex={-1}>
        {/* City */}
        <div className="city-field">
          <FaMapMarkerAlt className="city-icon" aria-hidden="true" />
          <select
            name="city"
            aria-label="Choose city"
            value={filters.city}
            onChange={(e) => {
              onFilterChange(e);
              onSearch(); // auto-search on city change
            }}
            className="city-select"
          >
            <option value="">Select your city</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="caret" aria-hidden="true" />
        </div>

        {/* Input */}
        <input
          type="text"
          name="q"
          aria-label="Search text"
          placeholder="Search for locality, landmark, project, or builder"
          value={filters.q}
          onChange={onFilterChange}
          onKeyDown={handleKeyPress}
          className="query-input"
        />

        {/* Button */}
        <button
          type="button"
          className="search-btn"
          onClick={onSearch}
          aria-label="Search"
        >
          <FaSearch aria-hidden="true" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
