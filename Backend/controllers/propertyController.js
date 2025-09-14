const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");

// Create property
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
      owner: req.user.userId,
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
    });

    await newProperty.save();
    res.status(201).json({ msg: "Property created", property: newProperty });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ msg: "Failed to create property" });
  }
};

// Get all properties with filters
exports.getAllProperties = async (req, res) => {
  try {
    const {
      city,
      type,
      status,
      bedrooms,
      minRent,
      maxRent,
      q, // title search
      owner, // owner name search
    } = req.query;

    const filter = {};

    if (city) filter.city = { $regex: city, $options: "i" };
    if (type) filter.type = { $regex: type, $options: "i" };
    if (status) filter.status = status;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }
    if (q) filter.title = { $regex: q, $options: "i" };

    let query = Property.find(filter).populate("owner", "name email");
    const properties = await query.exec();

    const result = owner
      ? properties.filter((p) =>
          p.owner?.name?.toLowerCase().includes(owner.toLowerCase())
        )
      : properties;

    res.json(result);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ msg: "Error fetching properties" });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");
    if (!property) return res.status(404).json({ msg: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(404).json({ msg: "Property not found" });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (property.owner.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized" });

    const updatableFields = [
      "title",
      "description",
      "address",
      "city",
      "state",
      "country",
      "rent",
      "bedrooms",
      "bathrooms",
      "area",
      "type",
      "amenities",
      "status",
    ];

    updatableFields.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "amenities" && typeof req.body[f] === "string") {
          property[f] = JSON.parse(req.body[f]);
        } else {
          property[f] = req.body[f];
        }
      }
    });

    await property.save();
    res.json({ msg: "Property updated", property });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ msg: "Error updating property" });
  }
};

// Add more images
exports.addImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });
    if (property.owner.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized" });

    let imageUrls = [];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (let file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        imageUrls.push(result.secure_url);
      }
    } else {
      return res.status(400).json({ msg: "No images uploaded" });
    }

    property.images.push(...imageUrls);
    await property.save();

    res.json({ msg: "Images added", images: property.images });
  } catch (error) {
    console.error("Add images error:", error);
    res.status(500).json({ msg: "Error adding images" });
  }
};

// Remove image
exports.removeImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });
    if (property.owner.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized" });

    property.images = property.images.filter((img) => img !== imageUrl);
    await property.save();
    res.json({ msg: "Image removed", images: property.images });
  } catch (error) {
    console.error("Remove image error:", error);
    res.status(500).json({ msg: "Error removing image" });
  }
};

// Toggle status (available <-> rented)
exports.toggleStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (property.owner.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized" });

    property.status = property.status === "available" ? "rented" : "available";
    await property.save();
    res.json({ msg: "Status toggled", property });
  } catch (error) {
    console.error("Toggle status error:", error);
    res.status(500).json({ msg: "Error toggling status" });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (property.owner.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized" });

    await property.deleteOne();
    res.json({ msg: "Property deleted" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ msg: "Error deleting property" });
  }
};
