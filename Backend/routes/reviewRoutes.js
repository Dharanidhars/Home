const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const reviewController = require("../controllers/reviewController");

router.post("/", auth, role("tenant"), reviewController.submitReview);
router.get("/:propertyId", reviewController.getReviews);

module.exports = router;
