const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  addReview,
  getReviews,
  deleteReview,
  likeReview,
  replyToReview,
} = require("../controllers/reviewController");

// POST /api/reviews  (tenant only)
router.post("/", auth, role("tenant"), addReview);

// GET  /api/reviews/:propertyId  -> all reviews for a property
router.get("/:propertyId", getReviews);

// DELETE /api/reviews/:reviewId  (tenant who wrote it or admin)
router.delete("/:reviewId", auth, deleteReview);

// PUT /api/reviews/like/:reviewId (any logged-in user)
router.put("/like/:reviewId", auth, likeReview);

// PUT /api/reviews/reply/:reviewId (owner only)
router.put("/reply/:reviewId", auth, role("owner"), replyToReview);

module.exports = router;
