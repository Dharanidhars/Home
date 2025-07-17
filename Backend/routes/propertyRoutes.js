const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const propertyController = require("../controllers/propertyController");

router.use(fileUpload({ useTempFiles: true }));

router.post("/", auth, role("owner"), propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);

router.delete("/:id", auth, role("owner"), propertyController.deleteProperty);
router.put("/toggle-status/:id", auth, role("owner"), propertyController.togglePropertyStatus);

module.exports = router;
