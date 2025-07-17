const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const inquiryController = require("../controllers/inquiryController");

router.post("/", auth, role("tenant"), inquiryController.sendInquiry);
router.get("/my-inquiries", auth, role("tenant"), inquiryController.getUserInquiries);

module.exports = router;
