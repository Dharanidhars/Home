const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const wishlistController = require("../controllers/wishlistController");

// ✅ Get all wishlist items for tenant
router.get("/", auth, role("tenant"), wishlistController.getWishlist);

// ✅ Add property to wishlist
router.post("/", auth, role("tenant"), wishlistController.addToWishlist);

// ✅ Remove property from wishlist
router.delete("/:propertyId", auth, role("tenant"), wishlistController.removeFromWishlist);

module.exports = router;
