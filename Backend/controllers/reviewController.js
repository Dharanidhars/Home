const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    if (!propertyId) return res.status(400).json({ msg: "Property ID required" });
    if (!rating || Number(rating) < 1) {
      return res.status(400).json({ msg: "Please select a star rating" });
    }

    const review = new Review({
      tenant: req.user.userId,
      property: propertyId,
      rating,
      comment: comment || "",
    });

    await review.save();
    res.status(201).json({ msg: "Review submitted", review });
  } catch (err) {
    console.error("Add Review Error:", err);
    res.status(500).json({ msg: "Failed to submit review" });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate("tenant", "name")
      .populate("replies.owner", "name");
    res.json(reviews);
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res.status(500).json({ msg: "Failed to get reviews" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    if (
      review.tenant.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ msg: "Review deleted" });
  } catch (err) {
    console.error("Delete Review Error:", err);
    res.status(500).json({ msg: "Failed to delete review" });
  }
};

exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    const userId = req.user.userId;
    const exists = review.likes.includes(userId);

    if (exists) {
      review.likes = review.likes.filter((id) => id.toString() !== userId);
    } else {
      review.likes.push(userId);
    }

    await review.save();
    res.json({ msg: "Like toggled", likes: review.likes.length, liked: !exists });
  } catch (err) {
    console.error("Like Review Error:", err);
    res.status(500).json({ msg: "Failed to like/unlike review" });
  }
};

exports.replyToReview = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ msg: "Message is required" });

    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    review.replies.push({
      owner: req.user.userId,
      message,
      createdAt: new Date(),
    });

    await review.save();
    res.json({ msg: "Reply added", review });
  } catch (err) {
    console.error("Reply Review Error:", err);
    res.status(500).json({ msg: "Failed to reply to review" });
  }
};
