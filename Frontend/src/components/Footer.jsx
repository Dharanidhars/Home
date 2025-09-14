import React from "react";
import { FaInstagram, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Social Media Icons */}
        <div className="footer-icons">
          <a href="#" aria-label="Instagram">
            <FaInstagram size={22} />
          </a>
          <a href="#" aria-label="YouTube">
            <FaYoutube size={22} />
          </a>
          <a href="#" aria-label="Twitter">
            <FaTwitter size={22} />
          </a>
          <a href="#" aria-label="Facebook">
            <FaFacebook size={22} />
          </a>
        </div>

        {/* Footer Text */}
        <p className="footer-text">
          &copy; {new Date().getFullYear()} <span className="brand">HOMIE</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
