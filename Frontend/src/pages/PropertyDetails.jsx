import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactModal from "react-modal";
import { AuthContext } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import "../styles/PropertyDetails.css";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [message, setMessage] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API}/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Fetch property error:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API}/api/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    };

    fetchProperty();
    fetchReviews();
  }, [id]);

  const refreshReviews = async () => {
    const res = await axios.get(`${API}/api/reviews/${id}`);
    setReviews(res.data);
  };

  const sendInquiry = async () => {
    if (!token) return alert("Please login first");
    if (!message.trim()) return alert("Please type your message");

    try {
      await axios.post(
        `${API}/api/inquiries`,
        { propertyId: id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Inquiry sent");
      setMessage("");
    } catch (err) {
      console.error("Inquiry error:", err);
    }
  };

  const submitReview = async () => {
    if (!token) return alert("Please login first");
    if (newReview.rating < 1) return alert("Please select a star rating");

    try {
      await axios.post(
        `${API}/api/reviews`,
        { propertyId: id, rating: newReview.rating, comment: newReview.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted");
      setNewReview({ rating: 0, comment: "" });
      await refreshReviews();
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  const deleteReview = async (reviewId, tenantId) => {
    if (!token) return alert("Please login first");
    if (user?.id !== tenantId && user?.role !== "admin") {
      return alert("You can delete only your review");
    }
    if (!window.confirm("Delete this review?")) return;

    try {
      await axios.delete(`${API}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshReviews();
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  const likeReview = async (reviewId) => {
    if (!token) return alert("Please login first");
    try {
      await axios.put(
        `${API}/api/reviews/like/${reviewId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshReviews();
    } catch (err) {
      console.error("Like review error:", err);
    }
  };

  const replyToReview = async (reviewId, replyMessage) => {
    if (!token) return alert("Please login first");
    if (!replyMessage.trim()) return alert("Reply cannot be empty");

    try {
      await axios.put(
        `${API}/api/reviews/reply/${reviewId}`,
        { message: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshReviews();
    } catch (err) {
      console.error("Reply review error:", err);
    }
  };

  if (!property) return <div className="property-details-container">Loading...</div>;

  return (
    <div className="property-details-container">
      <h2><i className="fas fa-home"></i> {property.title}</h2>

      <img
        src={property.images?.[0]}
        alt={property.title}
        className="main-image"
        onClick={() => { setCurrentImageIndex(0); setIsModalOpen(true); }}
      />

      <div className="image-gallery">
        {property.images?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`property-img-${i}`}
            className="thumbnail"
            onClick={() => { setCurrentImageIndex(i); setIsModalOpen(true); }}
          />
        ))}
      </div>

      <div className="property-info">
        <p><i className="fas fa-rupee-sign"></i> Rent: <strong>₹{property.rent}</strong></p>
        <p><i className="fas fa-map-marker-alt"></i> Location: {property.city}, {property.state}, {property.country}</p>
        <p><i className="fas fa-align-left"></i> Description: {property.description}</p>
      </div>

      {/* Tenant only actions */}
      {user?.role === "tenant" && (
        <>
          <h3>📩 Contact Owner</h3>
          <textarea
            rows="4"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="primary-btn" onClick={sendInquiry}>
            <i className="fas fa-paper-plane"></i> Send Inquiry
          </button>

          <hr />

          <h3>⭐ Submit Your Review</h3>
          <StarRating
            rating={newReview.rating}
            onRatingChange={(value) => setNewReview({ ...newReview, rating: value })}
            interactive={true}
          />
          <textarea
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            rows={3}
          />
          <button className="primary-btn" onClick={submitReview}>
            <i className="fas fa-star"></i> Submit Review
          </button>
        </>
      )}

      <h3 style={{ marginTop: 26 }}>📝 Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r) => (
        <div key={r._id} className="review-box">
          <div className="review-header">
            <strong><i className="fas fa-user"></i> {r.tenant?.name || "User"}</strong>
            <StarRating rating={r.rating} interactive={false} size={20} />
          </div>

          <p className="review-comment">{r.comment}</p>
          <p className="likes">❤️ {r.likes?.length || 0}</p>

          {user && (user.id === r.tenant?._id || user.role === "admin") && (
            <button className="delete-btn" onClick={() => deleteReview(r._id, r.tenant?._id)}>
              <i className="fas fa-trash"></i> Delete
            </button>
          )}

          {user && (
            <button className="like-btn" onClick={() => likeReview(r._id)}>
              {r.likes?.includes?.(user.id) ? "💔 Unlike" : "❤️ Like"}
            </button>
          )}

          {user?.role === "owner" && (
            <ReplyBox review={r} onReply={(msg) => replyToReview(r._id, msg)} />
          )}

          {r.replies?.length > 0 && (
            <div className="reply-list">
              {r.replies.map((rep, idx) => (
                <div key={idx} className="reply">
                  <strong><i className="fas fa-reply"></i> Owner Reply:</strong> {rep.message}
                  <span className="reply-date">({new Date(rep.createdAt).toLocaleString()})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="image-modal"
        overlayClassName="image-overlay"
        ariaHideApp={false}
      >
        <img src={property.images?.[currentImageIndex]} alt="Full Property" className="full-image" />
        <div className="modal-controls">
          <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}>
            ‹ Prev
          </button>
          <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % property.images.length)}>
            Next ›
          </button>
          <button onClick={() => setIsModalOpen(false)}>❌ Close</button>
        </div>
      </ReactModal>
    </div>
  );
};

const ReplyBox = ({ review, onReply }) => {
  const [reply, setReply] = useState("");
  if (review.replies?.length) return null;

  return (
    <div className="reply-section">
      <textarea
        rows="2"
        placeholder="Write a reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button className="primary-btn" onClick={() => onReply(reply)}>
        <i className="fas fa-reply"></i> Reply
      </button>
    </div>
  );
};

export default PropertyDetails;
