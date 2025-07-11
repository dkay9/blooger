const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newComment = await Comment.create({
      postId,
      text,
      userId: req.user.id,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    const populatedComment = await newComment.populate('userId', 'name avatar');
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })
    .populate("userId", "name avatar");

    console.log("Fetched comments:", comments);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
