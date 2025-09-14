import React from "react";
import "../styles/FilterSidebar.css";

const FilterSidebar = ({ filters, onFilterChange, onApply, onClear }) => {
  return (
    <aside className="filter-sidebar">
      <h3><i className="fas fa-filter"></i> Filters</h3>

      {/* BHK Type */}
      <label>
        <i className="fas fa-bed"></i> BHK Type
      </label>
      <select
        name="bedrooms"
        value={filters.bedrooms}
        onChange={onFilterChange}
      >
        <option value="">Any</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
        <option value="4">4 BHK</option>
      </select>

      {/* Min Rent */}
      <label>
        <i className="fas fa-rupee-sign"></i> Min Rent
      </label>
      <input
        type="number"
        name="minRent"
        placeholder="₹"
        value={filters.minRent}
        onChange={onFilterChange}
      />

      {/* Max Rent */}
      <label>
        <i className="fas fa-rupee-sign"></i> Max Rent
      </label>
      <input
        type="number"
        name="maxRent"
        placeholder="₹"
        value={filters.maxRent}
        onChange={onFilterChange}
      />

      {/* Property Type */}
      <label>
        <i className="fas fa-building"></i> Property Type
      </label>
      <select name="type" value={filters.type} onChange={onFilterChange}>
        <option value="">All</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="House">House</option>
        <option value="Condo">Condo</option>
      </select>

      {/* Status */}
      <label>
        <i className="fas fa-info-circle"></i> Status
      </label>
      <select name="status" value={filters.status} onChange={onFilterChange}>
        <option value="">All</option>
        <option value="available">Available</option>
        <option value="rented">Rented</option>
      </select>

      {/* Action Buttons */}
      <button className="apply-btn" onClick={onApply}>
        <i className="fas fa-check"></i> Apply
      </button>
      <button className="clear-btn" onClick={onClear}>
        <i className="fas fa-undo"></i> Clear
      </button>
    </aside>
  );
};

export default FilterSidebar;
