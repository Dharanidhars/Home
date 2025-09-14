import React from "react";
import { Link } from "react-router-dom";
import "../styles/PropertyCard.css";
import { FaMapMarkerAlt, FaRupeeSign, FaUser, FaInfoCircle } from "react-icons/fa";

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <div className="image-wrapper">
        <img src={property.images?.[0]} alt={property.title} />
        <div
          className={`status-tag ${
            property.status === "rented" ? "rented" : "available"
          }`}
        >
          {property.status}
        </div>
      </div>
      <div className="card-content">
        <h3>{property.title}</h3>
        <p>
          <FaMapMarkerAlt /> {property.city}, {property.state}
        </p>
        <p>
          <FaRupeeSign /> <strong>{property.rent}</strong>/month
        </p>
        <p>
          <FaUser /> Owner: {property.owner?.name || "Unknown"}
        </p>
        <Link to={`/property/${property._id}`} className="view-btn">
          <FaInfoCircle /> View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
