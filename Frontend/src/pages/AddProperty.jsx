import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddProperty.css";
import { AuthContext } from "../context/AuthContext";

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    rent: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    type: "",
    amenities: "",
    images: [],
  });

  const handleImageChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login as owner to add a property.");
      navigate("/login");
      return;
    }

    if (user?.role !== "owner") {
      alert("Only owners can add properties.");
      return;
    }

    // Validate number fields
    const numericFields = ["rent", "bedrooms", "bathrooms", "area"];
    for (let field of numericFields) {
      if (isNaN(form[field]) || form[field] === "") {
        alert(`Please enter a valid number for ${field}`);
        return;
      }
    }

    const formData = new FormData();
    for (let key in form) {
      if (key === "images") {
        for (let i = 0; i < form.images.length; i++) {
          formData.append("images", form.images[i]);
        }
      } else {
        formData.append(key, form[key]);
      }
    }

    formData.set("amenities", JSON.stringify(form.amenities.split(",")));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/properties",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Property added successfully!");
      navigate("/"); // redirect to home or dashboard
    } catch (error) {
      console.error("Add property error:", error);
      const errMsg =
        error.response?.data?.msg || "Something went wrong. Try again.";
      alert("❌ Error adding property: " + errMsg);
    }
  };

  return (
    <div className="add-property-container">
      <form className="add-property-form" onSubmit={handleSubmit}>
        <h2>Add New Property</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
        />
        <input
          type="number"
          name="rent"
          placeholder="Monthly Rent"
          value={form.rent}
          onChange={handleChange}
        />
        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
        />
        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
        />
        <input
          type="number"
          name="area"
          placeholder="Area (sq ft)"
          value={form.area}
          onChange={handleChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type (Apartment, House, Villa...)"
          value={form.type}
          onChange={handleChange}
        />
        <input
          type="text"
          name="amenities"
          placeholder="Amenities (comma-separated)"
          value={form.amenities}
          onChange={handleChange}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty;
