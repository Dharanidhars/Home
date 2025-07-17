import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [myProperties, setMyProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/dashboard/owner/properties", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyProperties(res.data));
  }, []);

  const deleteProperty = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProperties((prev) => prev.filter((p) => p._id !== id));
      alert("Property deleted");
    } catch {
      alert("Failed to delete property");
    }
  };

  const toggleStatus = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/properties/toggle-status/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = res.data.property;
      setMyProperties((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch {
      alert("Failed to update property status");
    }
  };

  return (
    <div className="owner-dashboard">
      <h2>Your Properties</h2>
      {myProperties.length === 0 ? (
        <p>No properties added yet.</p>
      ) : (
        <div className="property-list">
          {myProperties.map((p) => (
            <div key={p._id} className="property-card">
              <img src={p.images[0]} alt={p.title} />
              <h3>{p.title}</h3>
              <p>
                {p.city}, {p.state}
              </p>
              <p>₹{p.rent}</p>
              <p>
                Status:{" "}
                <span
                  className={
                    p.status === "rented" ? "rented-badge" : "available-badge"
                  }
                >
                  {p.status}
                </span>
              </p>

              <div className="owner-actions">
                <Link to={`/property/${p._id}`} className="details-button">
                  🔍 View Details
                </Link>
                <button onClick={() => deleteProperty(p._id)}>🗑️ Delete</button>
                <button onClick={() => toggleStatus(p._id)}>
                  {p.status === "available"
                    ? "📛 Mark as Rented"
                    : "✅ Mark as Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
