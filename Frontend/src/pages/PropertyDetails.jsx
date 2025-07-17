import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import ReactModal from "react-modal";
import { AuthContext } from "../context/AuthContext";
import "../styles/PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch(() => alert("Error loading property"));

    axios
      .get(`http://localhost:5000/api/reviews/${id}`)
      .then((res) => setReviews(res.data));
  }, [id]);

  const sendInquiry = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    try {
      await axios.post(
        "http://localhost:5000/api/inquiries",
        { propertyId: id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Inquiry sent");
      setMessage("");
    } catch (err) {
      alert("Failed to send inquiry");
    }
  };

  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        { propertyId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted");
      setRating(5);
      setComment("");
      const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  if (!property) return <div>Loading...</div>;

  return (
    <div className="property-details-container">
      <h2>{property.title}</h2>

      <img
        src={property.images[0]}
        alt={property.title}
        className="main-image"
        onClick={() => {
          setCurrentImageIndex(0);
          setIsModalOpen(true);
        }}
      />

      <div className="image-gallery">
        {property.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            className="thumbnail"
            onClick={() => {
              setCurrentImageIndex(i);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <p>
        <strong>Rent:</strong> ₹{property.rent}
      </p>
      <p>
        <strong>Location:</strong> {property.city}, {property.state},{" "}
        {property.country}
      </p>
      <p>
        <strong>Description:</strong> {property.description}
      </p>

      {user?.role === "tenant" && (
        <>
          <h3>Contact Owner</h3>
          <textarea
            rows="4"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendInquiry}>Send Inquiry</button>

          <hr />

          <h3>Leave a Review</h3>
          <ReactStars
            count={5}
            value={rating}
            onChange={setRating}
            size={30}
            activeColor="#ffd700"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review"
            rows="3"
          />
          <button onClick={submitReview}>Submit Review</button>
        </>
      )}

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="review-box">
            <strong>{r.user.name}</strong> — <span>⭐ {r.rating}</span>
            <p>{r.comment}</p>
          </div>
        ))
      )}

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="image-modal"
        overlayClassName="image-overlay"
        ariaHideApp={false}
      >
        <img
          src={property.images[currentImageIndex]}
          alt="Full Property"
          className="full-image"
        />
        <div className="modal-controls">
          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === 0 ? property.images.length - 1 : prev - 1
              )
            }
          >
            ‹ Prev
          </button>
          <button
            onClick={() =>
              setCurrentImageIndex(
                (prev) => (prev + 1) % property.images.length
              )
            }
          >
            Next ›
          </button>
          <button onClick={() => setIsModalOpen(false)}>❌ Close</button>
        </div>
      </ReactModal>
    </div>
  );
};

export default PropertyDetails;
