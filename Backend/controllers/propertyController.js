const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");

exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      state,
      country,
      rent,
      bedrooms,
      bathrooms,
      area,
      type,
      amenities,
    } = req.body;

    let imageUrls = [];

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (let file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        imageUrls.push(result.secure_url);
      }
    }

    const newProperty = new Property({
      title,
      description,
      address,
      city,
      state,
      country,
      rent,
      bedrooms,
      bathrooms,
      area,
      type,
      amenities: JSON.parse(amenities),
      images: imageUrls,
      owner: req.user.userId,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("🔥 Property Creation Error:", error);
    res.status(500).json({
      msg: "Error creating property",
      error: error.message,
      stack: error.stack,
    });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching properties" });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!property) return res.status(404).json({ msg: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching property" });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ msg: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting property" });
  }
};

exports.togglePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    property.status = property.status === "available" ? "rented" : "available";
    await property.save();

    res.json({ msg: `Property marked as ${property.status}`, property });
  } catch (err) {
    res.status(500).json({ msg: "Error toggling property status" });
  }
};
