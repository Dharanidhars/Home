const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  addImages,
  removeImage,
  toggleStatus,
  deleteProperty,
} = require("../controllers/propertyController");

// Enable file uploads
router.use(fileUpload({ useTempFiles: true }));

// Create a property
router.post("/", auth, role("owner"), createProperty);

// Get all properties (with filters)
router.get("/", getAllProperties);

// Get property by ID
router.get("/:id", getPropertyById);

// Update a property
router.put("/:id", auth, role("owner"), updateProperty);

// Add more images
router.patch("/:id/images", auth, role("owner"), addImages);

// Remove an image (send { imageUrl } in body)
router.delete("/:id/images", auth, role("owner"), removeImage);

// Toggle availability status
router.put("/toggle-status/:id", auth, role("owner"), toggleStatus);

// Delete property
router.delete("/:id", auth, role("owner"), deleteProperty);

module.exports = router;
