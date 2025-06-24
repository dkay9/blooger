const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true }, // 🟢 ADD THIS
  thumbnail: { type: String, required: true }, // 🟢 ADD THIS
  category: { type: String, required: true }, // 🟢 OPTIONAL: add category if you're using it
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Post", postSchema);
