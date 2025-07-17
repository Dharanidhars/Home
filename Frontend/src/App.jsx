import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AddProperty from "./pages/AddProperty";
import PropertyList from "./pages/PropertyList";
import PropertyDetails from "./pages/PropertyDetails";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context
import { AuthContext } from "./context/AuthContext";

// Styles
import "./styles/global.css";

const App = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main style={{ minHeight: "80vh", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/property/:id" element={<PropertyDetails />} />

            {/* Owner-only Route */}
            <Route
              path="/add-property"
              element={
                user?.role === "owner" ? <AddProperty /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/dashboard/owner"
              element={
                user?.role === "owner" ? <OwnerDashboard /> : <Navigate to="/login" />
              }
            />

            {/* Tenant-only Route */}
            <Route
              path="/dashboard/tenant"
              element={
                user?.role === "tenant" ? <TenantDashboard /> : <Navigate to="/login" />
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
