const Inquiry = require("../models/Inquiry");

exports.sendInquiry = async (req, res) => {
  try {
    const newInquiry = new Inquiry({
      property: req.body.propertyId,
      user: req.user.userId,
      message: req.body.message
    });
    await newInquiry.save();
    res.status(201).json({ msg: "Inquiry sent" });
  } catch (error) {
    res.status(500).json({ msg: "Error sending inquiry" });
  }
};

exports.getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.userId }).populate("property");
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching inquiries" });
  }
};
