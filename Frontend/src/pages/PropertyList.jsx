import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/PropertyList.css";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  return (
    <div className="property-list">
      <h2>Available Rentals</h2>
      <div className="property-carousel">
        {properties.map((prop) => (
          <div key={prop._id} className="property-card">
            <div className="property-image-wrapper">
              <img src={prop.images[0]} alt={prop.title} />
              {prop.status === "rented" && (
                <span className="property-status rented">Rented</span>
              )}
              {prop.status === "available" && (
                <span className="property-status available">Available</span>
              )}
            </div>
            <div className="property-content">
              <h3>{prop.title}</h3>
              <p>
                {prop.city}, {prop.state}
              </p>
              <p>₹{prop.rent}/month</p>
              <Link to={`/property/${prop._id}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
