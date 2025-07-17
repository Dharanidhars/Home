import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";
import homieLogo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={homieLogo} alt="Homie Logo" />
        <Link to="/">HOMIE</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {user?.role === "owner" && (
          <>
            <Link to="/add-property">Add Property</Link>
            <Link to="/dashboard/owner">Owner Dashboard</Link>
          </>
        )}

        {user?.role === "tenant" && (
          <Link to="/dashboard/tenant">Tenant Dashboard</Link>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
