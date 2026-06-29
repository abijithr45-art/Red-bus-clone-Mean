const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userEmail: String,
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["booking", "cancel", "schedule", "reminder", "offer"],
    default: "booking"
  },
  channels: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  language: { type: String, default: "en" },
  deliveryStatus: {
    email: { type: String, default: "pending" },
    push: { type: String, default: "pending" }
  },
  retryCount: { type: Number, default: 0 },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notifications", notificationSchema);