import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddProperty.css";
import { AuthContext } from "../context/AuthContext";
import {
  FaHome,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaList,
  FaImage,
  FaTrash,
  FaPlus,
  FaAlignLeft,
} from "react-icons/fa";

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

  const [previewImages, setPreviewImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    const updatedFiles = [...form.images];
    updatedFiles.splice(index, 1);
    setForm({ ...form, images: updatedFiles });

    const updatedPreview = [...previewImages];
    updatedPreview.splice(index, 1);
    setPreviewImages(updatedPreview);
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
      await axios.post("http://localhost:5000/api/properties", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Property added successfully!");
      navigate("/");
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
        <h2>
          <FaHome /> Add New Property
        </h2>

        <div className="input-group">
          <FaHome className="input-icon" />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {/* Description with top-left icon */}
        <div className="input-group textarea-group">
          <FaAlignLeft className="input-icon top-icon" />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="input-group">
            <FaRupeeSign className="input-icon" />
            <input
              type="number"
              name="rent"
              placeholder="Monthly Rent"
              value={form.rent}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <FaBed className="input-icon" />
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <FaBath className="input-icon" />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <FaRulerCombined className="input-icon" />
            <input
              type="number"
              name="area"
              placeholder="Area (sq ft)"
              value={form.area}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <FaList className="input-icon" />
          <input
            type="text"
            name="type"
            placeholder="Type (Apartment, House, Villa...)"
            value={form.type}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <FaList className="input-icon" />
          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma-separated)"
            value={form.amenities}
            onChange={handleChange}
          />
        </div>

        <div className="input-group file-input">
          <FaImage className="input-icon" />
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Image Preview */}
        <div className="preview-grid">
          {previewImages.map((src, index) => (
            <div key={index} className="image-preview">
              <img src={src} alt={`preview-${index}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeImage(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">
          <FaPlus /> Add Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
