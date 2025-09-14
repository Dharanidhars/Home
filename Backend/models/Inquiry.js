const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  repliedAt: Date,
});

const inquirySchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    message: String,
    reply: replySchema, // Owner's reply
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
