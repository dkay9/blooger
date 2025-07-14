const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, content, slug, excerpt, thumbnail, category } = req.body;

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Optional: Check for duplicate slug
    const existing = await Post.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "Slug already exists" });
    }

    // Create the post
    const newPost = new Post({
      title,
      content,
      slug,
      excerpt,
      thumbnail,
      category,
      author: req.user.id, // from token
    });

    await newPost.save();
    const populatedPost = await Post.findById(newPost._id).populate("author", "name username bio image");
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name bio image username") // Populate just the author's name
      .lean(); // lean() makes it return plain JS objects

    const postsWithCounts = posts.map((post) => ({
      ...post,
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.length || 0,
    }));
// console.log(posts)
    res.json(postsWithCounts);
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("comments")
      .populate("likes")
      .populate("author", "name bio image"); // Include author's name here too

    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id; // coming from auth middleware
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};