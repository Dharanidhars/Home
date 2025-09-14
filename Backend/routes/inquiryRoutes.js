const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const inquiryController = require("../controllers/inquiryController");

// Tenant: Send Inquiry
router.post("/", auth, role("tenant"), inquiryController.sendInquiry);

// Tenant: View All Inquiries
router.get("/tenant", auth, role("tenant"), inquiryController.getUserInquiries);

// Tenant: Delete Inquiry (within 5 minutes only)
router.delete("/:id", auth, role("tenant"), inquiryController.deleteInquiry);

// Owner: View Inquiries made to their Properties
router.get("/owner", auth, role("owner"), inquiryController.getOwnerInquiries);

// Owner: Reply to a Specific Inquiry
router.put("/reply/:id", auth, role("owner"), inquiryController.replyToInquiry);

// ✅ Owner: Delete Inquiry (any time)
router.delete("/owner/:id", auth, role("owner"), inquiryController.ownerDeleteInquiry);

module.exports = router;
