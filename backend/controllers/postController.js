const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, content, slug, excerpt, thumbnail, category } = req.body;

    const newPost = new Post({
      title,
      content,
      slug,
      excerpt,
      thumbnail,
      category,
      author: req.user.id, // 👈 Automatically from token
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean(); // lean() returns plain JS objects

    const postsWithCounts = posts.map((post) => ({
      ...post,
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.length || 0,
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("comments likes");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
