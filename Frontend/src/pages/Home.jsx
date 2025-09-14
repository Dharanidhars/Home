import React from "react";
import "../styles/Home.css";
import PropertyList from "./PropertyList";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Find Your Perfect Rental Home</h1>
          <p className="hero-subtitle">
            Browse through thousands of listings and choose your dream rental with ease.
          </p>
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section">
        <PropertyList />
      </section>
    </div>
  );
};

export default Home;
