const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Property = require("../models/Property");
const Inquiry = require("../models/Inquiry");
const User = require("../models/User");

// Owner - View their properties
router.get("/owner/properties", auth, role("owner"), async (req, res) => {
  const properties = await Property.find({ owner: req.user.userId });
  res.json(properties);
});

// Owner - View inquiries to their properties
router.get("/owner/inquiries", auth, role("owner"), async (req, res) => {
  const ownerProperties = await Property.find({ owner: req.user.userId }).select("_id");
  const propIds = ownerProperties.map(p => p._id);
  const inquiries = await Inquiry.find({ property: { $in: propIds } })
    .populate("user", "name")
    .populate("property", "title");
  res.json(inquiries);
});

// Tenant - View inquiries they sent
router.get("/tenant/inquiries", auth, role("tenant"), async (req, res) => {
  const inquiries = await Inquiry.find({ user: req.user.userId }).populate("property", "title");
  res.json(inquiries);
});

// Tenant - View wishlist
router.get("/tenant/wishlist", auth, role("tenant"), async (req, res) => {
  const user = await User.findById(req.user.userId).populate("favorites");
  res.json(user.favorites);
});

module.exports = router;
