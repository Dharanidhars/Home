import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "../styles/StarRating.css";

const StarRating = ({ rating = 0, onRatingChange, interactive = false, size = 28 }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (!interactive) return;
    onRatingChange?.(value);
  };

  const handleReset = () => {
    if (!interactive) return;
    onRatingChange?.(0);
  };

  return (
    <div
      className="star-rating-wrapper"
      onDoubleClick={handleReset}
      title="Double click to reset"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = interactive ? hover >= star || rating >= star : rating >= star;
        return (
          <FaStar
            key={star}
            size={size}
            className={`star ${active ? "filled" : ""} ${interactive ? "interactive" : ""}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
