import React from "react";
import { FaInstagram, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <a href="#"><FaInstagram size={22} /></a>
        <a href="#"><FaYoutube size={22} /></a>
        <a href="#"><FaTwitter size={22} /></a>
        <a href="#"><FaFacebook size={22} /></a>
      </div>
      <p>&copy; {new Date().getFullYear()} HOMIE. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
