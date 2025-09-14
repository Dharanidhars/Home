import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";
import homieLogo from "../assets/logo.png";
import {
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaBuilding,
  FaPlusCircle,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderAuthLinks = () => {
    if (!user) {
      return (
        <>
          <NavLink to="/login" className="nav-link" onClick={() => setOpen(false)}>
            <FaSignInAlt /> Login
          </NavLink>
          <NavLink to="/register" className="nav-link" onClick={() => setOpen(false)}>
            <FaUserPlus /> Register
          </NavLink>
        </>
      );
    }

    return (
      <>
        {user.role === "tenant" && (
          <NavLink
            to="/dashboard/tenant"
            className="nav-link"
            onClick={() => setOpen(false)}
          >
            <FaTachometerAlt /> Tenant Dashboard
          </NavLink>
        )}

        {user.role === "owner" && (
          <>
            <NavLink
              to="/add-property"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              <FaPlusCircle /> Add Property
            </NavLink>
            <NavLink
              to="/dashboard/owner"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              <FaBuilding /> Owner Dashboard
            </NavLink>
          </>
        )}

        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </>
    );
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={homieLogo} alt="Homie logo" className="brand-logo" />
          <span className="brand-text">HOMIE</span>
        </Link>

        <button
          className={`hamburger ${open ? "active" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={() => setOpen(false)}>
            <FaHome /> Home
          </NavLink>

          {renderAuthLinks()}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
