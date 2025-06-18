const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  res.json(await Post.find().sort({ createdAt: -1 }));
});

router.get("/:slug", async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

module.exports = router;
