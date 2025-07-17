const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const User = require("../models/User");

// Add to wishlist
router.post("/:propertyId", auth, role("tenant"), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.favorites.includes(req.params.propertyId)) {
      user.favorites.push(req.params.propertyId);
      await user.save();
    }
    res.json({ msg: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating wishlist" });
  }
});

// Get wishlist
router.get("/", auth, role("tenant"), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching wishlist" });
  }
});

module.exports = router;
