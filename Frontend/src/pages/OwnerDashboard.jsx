import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
  FaSearch,
} from "react-icons/fa";
import "../styles/OwnerDashboard.css";

const API = import.meta.env.VITE_API_URL;

const OwnerDashboard = () => {
  const token = localStorage.getItem("token");
  const [myProperties, setMyProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [editModal, setEditModal] = useState({ open: false, property: null });
  const [addImageFiles, setAddImageFiles] = useState({});

  const fetchData = async () => {
    const resProps = await axios.get(`${API}/api/dashboard/owner/properties`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyProperties(resProps.data);

    const resInq = await axios.get(`${API}/api/inquiries/owner`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInquiries(resInq.data);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    await axios.delete(`${API}/api/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyProperties((prev) => prev.filter((p) => p._id !== id));
  };

  const toggleStatus = async (id) => {
    const res = await axios.put(
      `${API}/api/properties/toggle-status/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const updated = res.data.property;
    setMyProperties((prev) => prev.map((p) => (p._id === id ? updated : p)));
  };

  const sendReply = async (inquiryId) => {
    if (!replyText[inquiryId]) return alert("Reply cannot be empty");
    await axios.put(
      `${API}/api/inquiries/reply/${inquiryId}`,
      { replyMessage: replyText[inquiryId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReplyText((prev) => ({ ...prev, [inquiryId]: "" }));
    const res = await axios.get(`${API}/api/inquiries/owner`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInquiries(res.data);
  };

  const deleteInquiryOwner = async (inquiryId) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await axios.delete(`${API}/api/inquiries/owner/${inquiryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInquiries((prev) => prev.filter((i) => i._id !== inquiryId));
  };

  // ---- Edit Property ----
  const openEdit = (property) => {
    setEditModal({
      open: true,
      property: { ...property, amenities: property.amenities.join(",") },
    });
  };

  const saveEdit = async () => {
    const p = editModal.property;
    const payload = { ...p };
    if (typeof payload.amenities === "string") {
      payload.amenities = JSON.stringify(
        payload.amenities.split(",").map((a) => a.trim())
      );
    }
    await axios.put(`${API}/api/properties/${p._id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Property updated");
    setEditModal({ open: false, property: null });
    fetchData();
  };

  // ---- Upload Images ----
  const uploadMoreImages = async (propertyId) => {
    const files = addImageFiles[propertyId];
    if (!files || !files.length) return alert("Select images first");

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append("images", files[i]);
    }
    await axios.patch(`${API}/api/properties/${propertyId}/images`, fd, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Images uploaded");
    fetchData();
  };

  // ---- Delete Single Image from Property ----
  const removeImage = async (propertyId, imageUrl) => {
    await axios.delete(`${API}/api/properties/${propertyId}/images`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { imageUrl },
    });
    alert("Image removed");
    fetchData();
  };

  return (
    <div className="owner-dashboard">
      <h2>🏠 Your Properties</h2>

      {myProperties.length === 0 ? (
        <p>No properties added yet.</p>
      ) : (
        <div className="property-list">
          {myProperties.map((p) => (
            <div key={p._id} className="property-card">
              <img src={p.images?.[0]} alt={p.title} className="property-img" />
              <h3>{p.title}</h3>
              <p className="location">
                {p.city}, {p.state}
              </p>
              <p className="rent">₹{p.rent}</p>
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
                  <FaSearch /> View
                </Link>
                <button onClick={() => openEdit(p)} className="edit-btn">
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => deleteProperty(p._id)}
                  className="delete-btn"
                >
                  <FaTrash /> Delete
                </button>
                <button onClick={() => toggleStatus(p._id)} className="status-btn">
                  {p.status === "available" ? (
                    <>
                      <FaTimesCircle /> Mark Rented
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Mark Available
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr />

      <h2>📩 Tenant Inquiries</h2>
      {inquiries.length === 0 ? (
        <p>No inquiries received yet.</p>
      ) : (
        inquiries.map((i) => (
          <div key={i._id} className="inquiry-box">
            <p>
              <strong>Tenant:</strong> {i.tenant?.name} ({i.tenant?.email})
            </p>
            <p>
              <strong>Property:</strong> {i.property?.title}
            </p>
            <p>
              <strong>Message:</strong> {i.message}
            </p>
            <p>
              <strong>Sent:</strong> {new Date(i.createdAt).toLocaleString()}
            </p>

            {i.reply ? (
              <p className="reply-box">
                <strong>Your Reply:</strong> {i.reply.message}
              </p>
            ) : (
              <div className="reply-section">
                <textarea
                  rows="2"
                  placeholder="Type reply..."
                  value={replyText[i._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [i._id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => sendReply(i._id)}>
                  <FaCheckCircle /> Send Reply
                </button>
              </div>
            )}

            <button
              onClick={() => deleteInquiryOwner(i._id)}
              className="delete-inquiry-btn"
            >
              <FaTrash /> Delete Inquiry
            </button>
          </div>
        ))
      )}

      {/* ===== Edit Modal ===== */}
      {editModal.open && (
        <div className="modal-backdrop">
          <div className="edit-modal">
            <h3>
              <FaEdit /> Edit Property
            </h3>

            {/* Basic Inputs */}
            <input
              type="text"
              placeholder="Title"
              value={editModal.property.title}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  property: { ...prev.property, title: e.target.value },
                }))
              }
            />
            <textarea
              placeholder="Description"
              value={editModal.property.description}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  property: { ...prev.property, description: e.target.value },
                }))
              }
            />

            <input
              type="text"
              placeholder="City"
              value={editModal.property.city}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  property: { ...prev.property, city: e.target.value },
                }))
              }
            />

            <input
              type="number"
              placeholder="Rent"
              value={editModal.property.rent}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  property: { ...prev.property, rent: e.target.value },
                }))
              }
            />

            <input
              type="text"
              placeholder="Amenities"
              value={editModal.property.amenities}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  property: { ...prev.property, amenities: e.target.value },
                }))
              }
            />

            {/* Image Manager */}
            <div className="image-manager">
              <h4>Manage Images</h4>
              <div className="image-grid">
                {editModal.property.images?.map((img, idx) => (
                  <div key={idx} className="image-item">
                    <img src={img} alt="property" />
                    <button onClick={() => removeImage(editModal.property._id, img)}>
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <label className="upload-label">
                <FaUpload /> Add More Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setAddImageFiles((prev) => ({
                    ...prev,
                    [editModal.property._id]: e.target.files,
                  }))
                }
              />
              <button onClick={() => uploadMoreImages(editModal.property._id)}>
                <FaUpload /> Upload
              </button>
            </div>

            <div className="modal-buttons">
              <button onClick={saveEdit}>
                <FaCheckCircle /> Save
              </button>
              <button
                className="secondary"
                onClick={() => setEditModal({ open: false, property: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
