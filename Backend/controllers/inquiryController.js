const Inquiry = require("../models/Inquiry");

// Send Inquiry (Tenant)
exports.sendInquiry = async (req, res) => {
  try {
    const newInquiry = new Inquiry({
      tenant: req.user.userId,
      property: req.body.propertyId,
      message: req.body.message,
    });
    await newInquiry.save();
    res.status(201).json({ msg: "Inquiry sent", inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ msg: "Error sending inquiry" });
  }
};

// Get Inquiries made by Tenant
exports.getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ tenant: req.user.userId })
      .populate("property", "title images rent")
      .populate("reply.owner", "name email");

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching inquiries" });
  }
};

// Delete Inquiry (Tenant side - only within 5 minutes)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ msg: "Inquiry not found" });

    if (inquiry.tenant.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized" });

    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - new Date(inquiry.createdAt) > fiveMinutes)
      return res.status(403).json({ msg: "Cannot delete after 5 minutes" });

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ msg: "Inquiry deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete inquiry" });
  }
};

// Owner: Get all inquiries made to this owner's properties
exports.getOwnerInquiries = async (req, res) => {
  try {
    const allInquiries = await Inquiry.find()
      .populate("property", "title owner")
      .populate("tenant", "name email")
      .populate("reply.owner", "name");

    const ownerInquiries = allInquiries.filter(
      (inq) => inq.property.owner.toString() === req.user.userId
    );

    res.json(ownerInquiries);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching owner inquiries" });
  }
};

// Owner: Reply to Inquiry
exports.replyToInquiry = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const inquiry = await Inquiry.findById(req.params.id).populate("property");

    if (!inquiry) return res.status(404).json({ msg: "Inquiry not found" });

    if (inquiry.property.owner.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized to reply" });

    inquiry.reply = {
      owner: req.user.userId,
      message: replyMessage,
      repliedAt: new Date(),
    };

    await inquiry.save();
    res.json({ msg: "Reply sent", inquiry });
  } catch (error) {
    res.status(500).json({ msg: "Failed to send reply" });
  }
};

// ✅ NEW: Owner: Delete Inquiry any time
exports.ownerDeleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("property");

    if (!inquiry) return res.status(404).json({ msg: "Inquiry not found" });

    if (inquiry.property.owner.toString() !== req.user.userId)
      return res.status(403).json({ msg: "Not authorized to delete this inquiry" });

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ msg: "Inquiry deleted by owner" });
  } catch (err) {
    console.error("Owner delete inquiry error:", err);
    res.status(500).json({ msg: "Failed to delete inquiry" });
  }
};
