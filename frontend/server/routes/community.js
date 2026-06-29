const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/community");

router.get("/community", async (req, res) => {
  const posts = await CommunityPost.find({ status: "active" }).sort({ createdAt: -1 });
  res.json(posts);
});

router.post("/community", async (req, res) => {
  const post = await CommunityPost.create(req.body);
  res.status(201).json(post);
});

router.put("/community/:id/like", async (req, res) => {
  const post = await CommunityPost.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  res.json(post);
});

router.post("/community/:id/comment", async (req, res) => {
  const post = await CommunityPost.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: req.body } },
    { new: true }
  );
  res.json(post);
});

router.put("/community/:id/report", async (req, res) => {
  const post = await CommunityPost.findByIdAndUpdate(
    req.params.id,
    { $inc: { reports: 1 } },
    { new: true }
  );

  if (post.reports >= 3) {
    post.status = "hidden";
    await post.save();
  }

  res.json(post);
});

router.delete("/community/:id", async (req, res) => {
  await CommunityPost.findByIdAndDelete(req.params.id);
  res.json({ message: "Post removed" });
});

module.exports = router;