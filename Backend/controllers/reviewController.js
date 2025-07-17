const Review = require("../models/Review");

exports.submitReview = async (req, res) => {
  const { propertyId, rating, comment } = req.body;

  try {
    const review = new Review({
      property: propertyId,
      user: req.user.userId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ msg: "Review submitted" });
  } catch (error) {
    res.status(500).json({ msg: "Error adding review" });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId }).populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching reviews" });
  }
};
