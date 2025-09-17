import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/TenantDashboard.css";
import API_BASE_URL from "../utils/api";

const TenantDashboard = () => {
  const [wishlist, setWishlist] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWishlist(res.data));

    axios
      .get(`${API_BASE_URL}/api/inquiries/tenant`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInquiries(res.data));
  }, []);

  const deleteInquiry = async (id, createdAt) => {
    const token = localStorage.getItem("token");
    const now = new Date();
    const inquiryTime = new Date(createdAt);
    const diff = now - inquiryTime;

    if (diff > 5 * 60 * 1000) {
      return alert("You can delete inquiry only within 5 minutes");
    }

    if (!window.confirm("Are you sure to delete this inquiry?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries((prev) => prev.filter((i) => i._id !== id));
    } catch {
      alert("Failed to delete inquiry");
    }
  };

  return (
    <div className="tenant-dashboard">
      <h2>Tenant Dashboard</h2>

      <section>
        <h3>Wishlist</h3>
        {wishlist.length === 0 && <p>No properties in wishlist.</p>}
        <div className="wishlist-grid">
          {wishlist.map((p) => (
            <div className="card" key={p._id}>
              <h4>{p.title}</h4>
              <img src={p.images[0]} alt={p.title} />
              <p>₹{p.rent}/month</p>
              <Link to={`/property/${p._id}`} className="view-link">
                🔍 View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Your Inquiries</h3>
        {inquiries.length === 0 && <p>No inquiries sent.</p>}
        {inquiries.map((i) => (
          <div className="card" key={i._id}>
            <p>
              <strong>To:</strong> {i.property.title}
            </p>
            <p>
              <strong>Your Message:</strong> {i.message}
            </p>
            <p>
              <strong>Sent:</strong> {new Date(i.createdAt).toLocaleString()}
            </p>

            {i.reply ? (
              <p className="reply-box">
                <strong>Owner Reply:</strong> {i.reply.message}
              </p>
            ) : (
              <p className="no-reply">No reply yet</p>
            )}

            <button onClick={() => deleteInquiry(i._id, i.createdAt)} className="delete-btn">
               <i className="fas fa-trash"></i> Delete Inquiry
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TenantDashboard;
