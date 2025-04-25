import React, { useEffect, useState } from "react";
import "./Review.css";
import { FaRegArrowAltCircleLeft, FaStar } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const Review = ({ noOfStars = 5 }) => {
  const [reviews, setReviews] = useState([
    {
      name: "Sarah M",
      message:
        "I found my dream apartment in less than a day. Homie is a game changer!",
      rating: 4,
    },
    {
      name: "Adeel R",
      message: "So easy to use, and every listing felt trustworthy.",
      rating: 5,
    },
    {
      name: "Sangeetha V",
      message:
        "Homie made the entire rental process so easy. I found a place I loved, scheduled a visit, and signed the lease—all in one week!",
      rating: 4,
    },
  ]);

  const [current, setCurrent] = useState(0);
  const [rating, setRating] = useState(0);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newName.trim() === "" || newMessage.trim() === "" || rating === 0) {
      alert("Please fill the all field and select a rating!");
      return;
    }

    const newReview = {
      name: newName,
      message: newMessage,
      rating: rating,
    };

    setCurrent(reviews.length);
    setReviews((prevReviews) => [...prevReviews, newReview]);

    setNewName("");
    setNewMessage("");
    setRating(0);
  };

  const handleRating = (getCurrentIndex) => {
    setRating(getCurrentIndex);
    console.log(getCurrentIndex);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };
  const handlePrevious = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const intervel = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(intervel);
  }, [current]);
  return (
    <div className="reviews">
      <h1>Happy Customers</h1>
      <div className="reviewContainer">
        <FaRegArrowAltCircleLeft
          className="leftArrow"
          onClick={handlePrevious}
        />
        <div className="customerReview">
          <div className="customers">
            <p className="reviewMessage">"{reviews[current].message}"</p>
            <h2 className="costomersName">- {reviews[current].name}</h2>
            <p className="customerRating">
              {[...Array(reviews[current].rating)].map(() => {
                return <FaStar />;
              })}
            </p>
          </div>
        </div>
        <FaRegArrowAltCircleRight className="rightArrow" onClick={handleNext} />
      </div>
      <div className="dots">
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>

      <div className="addReview">
        <h2>Add Your Review</h2>
        <form className="reviewForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <textarea
            placeholder="Your Review"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          ></textarea>
          <div className="starRating">
            {[...Array(noOfStars)].map((_, index) => {
              const starIndex = (index += 1);

              return (
                <FaStar
                  key={index}
                  onClick={() => handleRating(starIndex)}
                  className={index <= rating ? "starActive" : "starInactive"}
                  size={25}
                />
              );
            })}
          </div>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Review;
