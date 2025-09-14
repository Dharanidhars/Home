import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchHeader from "../components/SearchHeader";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import "../styles/PropertyList.css";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    city: "",
    owner: "",
    type: "",
    status: "",
    bedrooms: "",
    minRent: "",
    maxRent: "",
  });

  const fetchData = async (customFilters = filters) => {
    try {
      const params = new URLSearchParams();
      Object.entries(customFilters).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });
      const res = await axios.get(`${API}/api/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "city") {
      fetchData({ ...filters, [name]: value });
    }
  };

  const clearFilters = () => {
    const empty = {
      q: "",
      city: "",
      owner: "",
      type: "",
      status: "",
      bedrooms: "",
      minRent: "",
      maxRent: "",
    };
    setFilters(empty);
    fetchData(empty);
  };

  return (
    <div className="property-page">
      {/* Search Bar ABOVE heading */}
      <SearchHeader
        filters={filters}
        onFilterChange={onFilterChange}
        onSearch={() => fetchData()}
      />

      {/* Dynamic Heading */}
      <h2 className="heading-dynamic">
        {filters.city
          ? `All Available Properties in ${filters.city}`
          : "All Available Properties"}
      </h2>

      <div className="property-content-wrapper">
        {/* Sidebar */}
        <div className="filter-sidebar-box">
          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            onApply={() => fetchData()}
            onClear={clearFilters}
          />
        </div>

        {/* Property Grid */}
        <div className="property-list-grid">
          {properties.length === 0 ? (
            <p className="no-results">No properties found</p>
          ) : (
            properties.map((p) => <PropertyCard key={p._id} property={p} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
