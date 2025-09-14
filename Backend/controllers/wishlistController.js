const Wishlist = require("../models/Wishlist");
const Property = require("../models/Property");

exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.userId }).populate("property");
    res.json(items.map((item) => item.property));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching wishlist", error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  const { propertyId } = req.body;
  try {
    const exists = await Wishlist.findOne({
      user: req.user.userId,
      property: propertyId,
    });

    if (exists) return res.status(400).json({ msg: "Already in wishlist" });

    const item = new Wishlist({
      user: req.user.userId,
      property: propertyId,
    });

    await item.save();
    res.status(201).json({ msg: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to add", error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user.userId,
      property: req.params.propertyId,
    });

    res.json({ msg: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to remove", error: err.message });
  }
};
