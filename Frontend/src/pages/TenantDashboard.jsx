import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/TenantDashboard.css";

const TenantDashboard = () => {
  const [wishlist, setWishlist] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/dashboard/tenant/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWishlist(res.data));

    axios
      .get("http://localhost:5000/api/dashboard/tenant/inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInquiries(res.data));
  }, []);

  return (
    <div className="tenant-dashboard">
      <h2>Tenant Dashboard</h2>

      <section>
        <h3>📌 Wishlist</h3>
        {wishlist.length === 0 ? (
          <p>No properties in wishlist.</p>
        ) : (
          <div className="card-grid">
            {wishlist.map((p) => (
              <div className="card" key={p._id}>
                <h4>{p.title}</h4>
                <img src={p.images[0]} alt={p.title} />
                <p>₹{p.rent}/month</p>
                <Link to={`/property/${p._id}`} className="view-btn">
                  🔍 View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3>📬 Your Inquiries</h3>
        {inquiries.length === 0 ? (
          <p>No inquiries sent.</p>
        ) : (
          <div className="card-grid">
            {inquiries.map((i) => (
              <div className="card" key={i._id}>
                <p>
                  <strong>Property:</strong> {i.property?.title || "Unknown"}
                </p>
                <p>
                  <strong>Message:</strong> {i.message}
                </p>
                <Link to={`/property/${i.property?._id}`} className="view-btn">
                  🔍 View Property
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TenantDashboard;
