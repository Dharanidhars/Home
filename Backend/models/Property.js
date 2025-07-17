const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  address: String,
  city: String,
  state: String,
  country: String,
  rent: Number,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  type: String,
  amenities: [String],
  images: [String],
  status: { type: String, enum: ["available", "rented"], default: "available" }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
