import React, { useEffect, useState } from "react";
import "./Review.css";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const Review = () => {
  const reviews = [
    {
      name: "Sarah M",
      message:
        "I found my dream apartment in less than a day. Homie is a game changer!",
    },
    {
      name: "Adeel R",
      message: "So easy to use, and every listing felt trustworthy.",
    },
    {
      name: "Sangeetha V",
      message:
        "Homie made the entire rental process so easy. I found a place I loved, scheduled a visit, and signed the lease—all in one week!",
    },
  ];

  const [current, setCurrent] = useState(0);

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
    </div>
  );
};

export default Review;
