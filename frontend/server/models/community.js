const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userName: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const communitySchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: String,
  title: { type: String, required: true },
  content: { type: String, required: true },
  topic: { type: String, required: true },
  photoUrl: String,
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  reports: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CommunityPosts", communitySchema);