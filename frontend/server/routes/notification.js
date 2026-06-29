const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

router.get("/notifications/:email", async (req, res) => {
  const notifications = await Notification.find({
    userEmail: req.params.email
  }).sort({ createdAt: -1 });

  res.json(notifications);
});

router.post("/notifications", async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      deliveryStatus: {
        email: req.body.channels?.email ? "sent" : "disabled",
        push: req.body.channels?.push ? "sent" : "disabled"
      }
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Notification failed", error });
  }
});

router.put("/notifications/:id/read", async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  res.json(notification);
});

router.put("/notifications/:id/retry", async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { retryCount: 1 },
      deliveryStatus: {
        email: "sent",
        push: "sent"
      }
    },
    { new: true }
  );

  res.json(notification);
});

module.exports = router;